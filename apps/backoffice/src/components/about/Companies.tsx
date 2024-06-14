export default function Companies() {
  return (
    <div className="absolute pb-24 pt-4 sm:pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Companies that make this possible
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://upload.wikimedia.org/wikipedia/commons/7/79/DigitalOcean_logo.png"
            alt="DigitalOcean"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-16 w-full object-contain lg:col-span-1"
            src="https://pngimg.com/uploads/github/github_PNG23.png"
            alt="GitHub"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-20 mb-1 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://logos-world.net/wp-content/uploads/2021/02/Docker-Logo.png"
            alt="Docker"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-11 mb-3 w-full object-contain lg:col-span-1"
            src="https://logodownload.org/wp-content/uploads/2019/05/lets-encrypt-logo-2.png"
            alt="Let's Encrypt"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 col-start-2 max-h-20 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://download.logo.wine/logo/Nginx/Nginx-Logo.wine.png"
            alt="Nginx"
            width={158}
            height={48}
          />
        </div>
      </div>
    </div>
  );
}
