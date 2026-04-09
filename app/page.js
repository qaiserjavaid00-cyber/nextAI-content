// 'use client';

// import { useFormState } from 'react-dom';
// import { submitPrompt } from '@/app/actions/ai';
// import SubmitButton from '@/components/ui/SubmitButton';
// import ReactMarkdown from "react-markdown"

// const initialState = {
//   result: null,
//   error: null,
// };

// export default function HomePage() {
//   const [state, formAction] = useFormState(submitPrompt, initialState);

//   return (
//     <main className="p-8 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">
//         AI Story Generator
//       </h1>

//       <form action={formAction} className="space-y-4">
//         <textarea
//           name="prompt"
//           placeholder="Write a short love story..."
//           className="w-full p-3 border rounded"
//           rows={4}
//         />

//         <SubmitButton />
//       </form>

//       {state.error && (
//         <p className="text-red-500 mt-4">{state.error}</p>
//       )}

//       {state.result && (
//         <div className="mt-6 p-4 border rounded bg-gray-50">
//           <strong>AI Response:</strong>
//           <ReactMarkdown >{state.result}</ReactMarkdown>
//         </div>
//       )}
//     </main>
//   );
// }


import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PromoCard from "@/components/custom/promoCard";

export default function Home() {
  return (
    <>
      <div
        className="relative bg-cover bg-center h-[50vh]"
        style={{ backgroundImage: 'url("/background.png")' }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#010818] z-0" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4">

            {/* Membership Banner */}
            <div className="flex items-center justify-between border border-slate-300 rounded-full bg-transparent px-4 py-2 w-full max-w-md mx-auto mb-4 hover:bg-slate-700/50 transition">
              <span className="text-slate-100">Join free membership</span>
              <span className="bg-slate-500 text-slate-100 rounded-full w-8 h-8 flex items-center justify-center">
                <ChevronRight />
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              AI Content Generator
            </h1>

            {/* Description */}
            <p className="text-white mb-6 max-w-xl mx-auto">
              Generate AI content for your blog, website, or social media with a
              single click and more.
            </p>

            {/* Button */}
            <Link href="/dashboard">
              <Button variant="outline">Get Started</Button>
            </Link>

          </div>
        </div>
      </div>
      <div className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <PromoCard
              title="Extensive Template Library"
              description="Choose from a wide range of templates for your content needs"
              link="/dashboard"
            />

            <PromoCard
              title="SEO Optimized Content"
              description="Get SEO optimized content for your blog or website"
              link="/dashboard"
            />

            <PromoCard
              title="Social Media Posts"
              description="Generate content for your social media posts"
              link="/dashboard"
            />

            <PromoCard
              title="AI Content Generator"
              description="Generate AI content for your blog, website, or social media with a single click"
              link="/dashboard"
            />
          </div>
        </div>
      </div>

      <footer className="py-4 text-center border-t-2">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AI Content Generator. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}