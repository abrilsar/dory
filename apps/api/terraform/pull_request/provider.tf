variable "ip" {}
variable "pwd" {}
variable "pvt_key" {}
variable "docker_command" {}
variable "github_branch" {}
variable "github_repo" {}
variable "do_token" {}
variable "pull" {}

locals {
  git_command = var.pull ? "git pull origin ${var.github_branch}" : "git reset HEAD~1 && git reset --hard HEAD"
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
  name = var.github_repo
}
