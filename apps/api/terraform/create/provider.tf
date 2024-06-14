variable "do_token" {}
variable "pub_key" {}
variable "pvt_key" {}
variable "region" {}
variable "size" {}
variable "docker_link" {}
variable "domain" {}
variable "pwd" {}
variable "email" {}
variable "name_project" {}
variable "github_link" {}
variable "github_repo" {}
variable "github_branch" {}
variable "docker_command" {}
variable "env" {}
variable "apps" {
  type = list(object({
    name = string
    port = string
  }))
  default = [
    {
      name = "docker-prueba"
      port = "3000"
    },
    {
      name = "api.docker-prueba"
      port = "3001"
    },
    # {
    #   name   = "backoffice.docker-prueba"
    #   port = "8082"
    # }
  ]
}

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_ssh_key" "terraform" {
  name = var.name_project
  # name = "test"
}
