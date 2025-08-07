# Portfolio

Built with next.js, [shadcn/ui](https://ui.shadcn.com/), and [magic ui](https://magicui.design/), deployed on Vercel.

# Features

- Setup only takes a few minutes by editing the [single config file](./src/data/resume.tsx)
- Built using Next.js 14, React, Typescript, Shadcn/UI, TailwindCSS, Framer Motion, Magic UI
- Includes a blog
- Responsive for different devices
- Optimized for Next.js and Vercel
- Image optimization with Cloudinary

# Getting Started Locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   Create a `.env.local` file with the following variables:

   ```env
   # Cloudinary Configuration
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key

   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token

   # Image Processing (Imgix - optional)
   IMGIX_URL=your_imgix_url
   ```

3. Start the local Server:

   ```bash
   pnpm dev
   ```

4. Open the [Config file](./src/data/resume.tsx) and make changes

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the Dashboard
3. Upload your images to Cloudinary
4. Update the environment variables with your Cloudinary URL

The app will automatically fetch and optimize images from your Cloudinary account.

TODO: Add testing framework.

# License

Licensed under the [MIT license](https://github.com/stevenmckinnon/portfolio/blob/main/LICENSE.md).
