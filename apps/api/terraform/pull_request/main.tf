resource "null_resource" "pull_request" {
  connection {
    host        = var.ip
    user        = "myuser"
    password    = var.pwd
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo bash -c 'cd ${var.github_repo}; docker-compose down'",
      "sudo bash -c 'cd ${var.github_repo}; docker image prune -a -f'",
      "sudo bash -c 'cd ${var.github_repo}; ${local.git_command}'",
      "sudo bash -c 'cd ${var.github_repo}; ${var.docker_command}'",
      # "sudo service nginx restart",
    ]
  }
}
