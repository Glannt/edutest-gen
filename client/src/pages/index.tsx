import DefaultLayout from '@/layouts/default';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { SocialProof } from '@/components/landing/social-proof';
import { Closing } from '@/components/landing/closing';

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
        <Hero />
        <Features />
        <SocialProof />
        <Closing />
        <footer className='bg-content2 py-8'>
          <div className='container mx-auto px-4 text-center text-small text-default-500'>
            © 2024 Test Creator Pro. Tất cả quyền được bảo lưu.
          </div>
        </footer>
      </section>
    </DefaultLayout>
  );
}
