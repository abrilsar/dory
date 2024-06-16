resource "digitalocean_droplet" "builder" {
  image  = "ubuntu-23-10-x64"
  name   = var.name_project
  region = var.region
  size   = var.size
  ssh_keys = [
    data.digitalocean_ssh_key.terraform.id,
  ]
  connection {
    host        = self.ipv4_address
    user        = "root"
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "2m"
  }

  provisioner "file" {
    source      = ".env"
    destination = "/etc/.env"
  }

  provisioner "remote-exec" {
    inline = [
      #Firewall
      "sudo apt-get update",
      "sudo ufw default deny incoming",
      "sudo ufw default allow outgoing",
      "sudo ufw allow OpenSSH",
      "echo 'y' | sudo ufw enable",

      #Add User
      "adduser myuser --disabled-password --gecos ''",
      "echo 'myuser: ${var.pwd}' | chpasswd",
      "sudo mkdir -p /home/myuser/.ssh",
      "sudo touch /home/myuser/.ssh/authorized_keys",
      "sudo echo '${var.pub_key}' > authorized_keys",
      "sudo mv authorized_keys /home/myuser/.ssh",
      "sudo chown -R myuser:myuser /home/myuser/.ssh",
      "sudo chmod 700 /home/myuser/.ssh",
      "sudo chmod 600 /home/myuser/.ssh/authorized_keys",
      "sudo usermod -aG sudo myuser",
      "echo 'myuser ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/myuser",
    ]
  }
}

resource "null_resource" "installer" {
  depends_on = [digitalocean_droplet.builder]
  connection {
    host        = digitalocean_droplet.builder.ipv4_address
    user        = "myuser"
    password    = var.pwd
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      #Git
      "git clone -b ${var.github_branch} ${var.github_link}",

      #Docker
      "sudo apt update",
      "sudo DEBIAN_FRONTEND=noninteractive apt install -y apt-transport-https ca-certificates curl software-properties-common",
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg",
      "echo ${var.docker_link} | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
      "sudo apt update",
      "sudo DEBIAN_FRONTEND=noninteractive apt install -y docker-ce",
      "sudo usermod -aG docker myuser",

      #Docker Compose
      "mkdir -p ~/.docker/cli-plugins/ && curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose",
      "chmod +x ~/.docker/cli-plugins/docker-compose",
      "sudo DEBIAN_FRONTEND=noninteractive apt install docker-compose -y",
      "sudo bash -c 'cd ${var.github_repo}; ${var.docker_command}'",

      #Nginx
      "sudo apt update",
      "sudo DEBIAN_FRONTEND=noninteractive apt install -y nginx",
      "sudo ufw app list",
      "sudo ufw allow 'Nginx Full'",

      # Domains - DNS Records
      "curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer ${var.do_token}' -d '{\"name\":\"${var.name_project}.${var.domain}\",\"ip_address\":\"${digitalocean_droplet.builder.ipv4_address}\",\"data\":\"${digitalocean_droplet.builder.ipv4_address}\"}' 'https://api.digitalocean.com/v2/domains'",
      "curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer ${var.do_token}' -d '{\"type\":\"A\",\"name\":\"*\",\"data\":\"${digitalocean_droplet.builder.ipv4_address}\",\"priority\":null,\"port\":null,\"ttl\":60,\"weight\":null,\"flags\":null,\"tag\":null}' 'https://api.digitalocean.com/v2/domains/${var.name_project}.${var.domain}/records'",

      #SSL certificate
      "sudo apt purge -y certbot",
      "sudo snap install --classic certbot",
      "sudo snap set certbot trust-plugin-with-root=ok",
      "sudo snap install certbot-dns-digitalocean",
      "sudo ln -s /snap/bin/certbot /usr/bin/certbot",
      "sudo echo 'dns_digitalocean_token = ${var.do_token}' | sudo tee -a ~/certbot-creds.ini",
      "sudo chmod 600 ~/certbot-creds.ini",
      "sudo certbot certonly --dns-digitalocean --dns-digitalocean-credentials ~/certbot-creds.ini -d '*.${lower(var.name_project)}.${var.domain}' -d '${lower(var.name_project)}.${var.domain}' --agree-tos -m ${var.email} --no-eff-email --redirect",
    ]
  }
}

resource "null_resource" "apps_settings" {
  for_each = { for idx, app in var.apps : idx => app }

  depends_on = [null_resource.installer]

  connection {
    host        = digitalocean_droplet.builder.ipv4_address
    user        = "myuser"
    password    = var.pwd
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      # Server blocks
      "sudo touch /etc/nginx/sites-available/${each.value.name}.${var.domain}",
      "sudo echo 'server { listen 80; server_name ${each.value.name}.${var.domain} www.${each.value.name}.${var.domain}; return 301 https://${each.value.name}.${var.domain}$request_uri; } server { listen 443 ssl; ssl_certificate /etc/letsencrypt/live/${lower(var.name_project)}.${var.domain}/fullchain.pem; ssl_certificate_key /etc/letsencrypt/live/${lower(var.name_project)}.${var.domain}/privkey.pem; server_name ${each.value.name}.${var.domain} www.${each.value.name}.${var.domain}; location / {proxy_pass http://${digitalocean_droplet.builder.ipv4_address}:${each.value.port}/; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection 'upgrade'; proxy_set_header Host $host; proxy_cache_bypass $http_upgrade; proxy_set_header X-Real-IP $remote_addr; proxy_set_header Cookie $http_cookie; proxy_pass_header Set-Cookie;}}' | sudo tee -a /etc/nginx/sites-available/${each.value.name}.${var.domain}",
      "sudo ln -s /etc/nginx/sites-available/${each.value.name}.${var.domain} /etc/nginx/sites-enabled/",
    ]
  }
}

resource "time_sleep" "wait_6_seconds" {
  create_duration = "6s"
  triggers = {
    "before" = "${null_resource.apps_settings[0].id}"
  }
}

resource "null_resource" "config" {
  depends_on = [time_sleep.wait_6_seconds]

  connection {
    host        = digitalocean_droplet.builder.ipv4_address
    user        = "myuser"
    password    = var.pwd
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo bash -c 'cd /etc/nginx/sites-enabled; sudo unlink default'",
      "sudo systemctl restart nginx",
    ]
  }
}
