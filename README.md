# Steve McKinnon Photography

Portfolio site for a Glasgow-based lifestyle and portrait photographer.
Built with Next.js and [shadcn/ui](https://ui.shadcn.com/), deployed on Vercel
at [stevenmckinnon.co.uk](https://stevenmckinnon.co.uk).

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS v4, shadcn/ui, [magic ui](https://magicui.design/)
- Motion for the gallery and lightbox animations
- Cloudinary for image hosting and on-the-fly resizing
- Resend for contact form delivery, Upstash Redis for rate limiting

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local`:

   ```env
   # Cloudinary — also used server-side for image transformations
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key

   # Rate limiting (Upstash)
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ```

   These are read server-side only. Do not add them to `next.config.ts`'s `env`
   block — that inlines values into any bundle that references them.

3. Run the dev server:

   ```bash
   pnpm dev
   ```

## Managing the gallery

Images are pulled from Cloudinary at request time by `/api/images`.

- **Adding photos** — upload to Cloudinary. They appear automatically, after
  any image listed in [`src/data/sortOrder.ts`](./src/data/sortOrder.ts).
- **Ordering** — list filenames in `sortOrder.ts`, most important first.
  Matching ignores case and treats spaces and underscores as equivalent, since
  Cloudinary rewrites spaces on upload.
- **Alt text and captions** — set the `alt` and `caption` context fields on each
  image in the Cloudinary media library. Without an `alt`, images fall back to a
  generic description.

The API only ever returns resized derivatives (`f_auto,q_auto`), never the
originals — see [`src/lib/cloudinary.ts`](./src/lib/cloudinary.ts).

## Site content

Name, tagline, contact details, social links and the social share image all live
in [`src/data/resume.tsx`](./src/data/resume.tsx).

## License

Licensed under the [MIT license](./LICENSE).
