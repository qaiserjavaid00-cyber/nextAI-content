// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useFormState, useFormStatus } from "react-dom";
// import { useSession } from "next-auth/react";

// import "@toast-ui/editor/dist/toastui-editor.css";
// import { toast } from "sonner";

// import templates from "@/utls/templates";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import SubmitButton from "@/components/ui/SubmitButton";
// import { generateAndSave } from "@/app/actions/query";
// import { useUsage } from "@/context/usage";

// import dynamic from "next/dynamic";

// const Editor = dynamic(
//     () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
//     { ssr: false }
// );


// const initialState = {
//     result: "",
//     error: null,

// };

// const Page = ({ params }) => {

//     // const [mounted, setMounted] = useState(false);

//     const { data: session } = useSession();
//     const user = session?.user;

//     const { subscribed, count, setCount, fetchUsage } = useUsage()

//     const [query, setQuery] = useState("");
//     const editorRef = useRef(null);

//     const selectedTemplate = templates.find(
//         (t) => t.slug === params.slug
//     );

//     const [state, formAction] = useFormState(generateAndSave, initialState);
//     // const { pending } = useFormStatus();
//     console.log("Editor ref:", editorRef.current);
//     // Update editor when result arrives
//     useEffect(() => {
//         if (!editorRef.current) return;

//         const editorInstance = editorRef.current.getInstance();

//         if (state.result && editorInstance) {
//             editorInstance.setMarkdown(state.result);
//             // const words = state.result.trim().split(/\s+/).length;
//             // setCount(prev => prev + words);
//         }

//         if (state.error) {
//             toast.error(state.error);
//         }
//     }, [state]);

//     useEffect(() => {
//         toast.success("Content generated & saved");
//         console.log("CLIENT STATE:", state);
//         fetchUsage()
//     }, [state]);

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
//             {/* LEFT PANEL */}
//             <div className="col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
//                 <div className="flex flex-col gap-3">
//                     <Image
//                         src={selectedTemplate.icon}
//                         alt={selectedTemplate.name}
//                         width={50}
//                         height={50}
//                     />
//                     <h2 className="font-medium text-lg">
//                         {selectedTemplate.name}
//                     </h2>
//                     <p className="text-gray-500">
//                         {selectedTemplate.desc}
//                     </p>
//                 </div>

//                 {/* ONE FORM — ONE BUTTON */}
//                 <form action={formAction} className="mt-6">
//                     {/* Hidden fields */}
//                     <input
//                         type="hidden"
//                         name="templateSlug"
//                         value={selectedTemplate.slug}
//                     />
//                     <input
//                         type="hidden"
//                         name="email"
//                         value={user?.email || ""}
//                     />

//                     {selectedTemplate.form.map((item) => (
//                         <div
//                             key={item.name}
//                             className="my-2 flex flex-col gap-2 mb-7"
//                         >
//                             <label className="font-bold pb-2">
//                                 {item.label}
//                             </label>

//                             {item.field === "input" ? (
//                                 <Input
//                                     name={item.name}
//                                     required={item.required}
//                                     onChange={(e) =>
//                                         setQuery(e.target.value)
//                                     }
//                                 />
//                             ) : (
//                                 <Textarea
//                                     name={item.name}
//                                     required={item.required}
//                                     onChange={(e) =>
//                                         setQuery(e.target.value)
//                                     }
//                                 />
//                             )}
//                         </div>
//                     ))}

//                     <SubmitButton subscribed={subscribed} count={count} />
//                 </form>
//             </div>

//             {/* RIGHT PANEL */}

//             {state && <div className="mt-6 p-4 md:col-span-2">
//                 <Editor
//                     key={state.result} // 🔥 forces re-render
//                     ref={editorRef}
//                     initialValue={state.result || "Generated content will appear here..."}
//                     previewStyle="vertical"
//                     height="600px"
//                     initialEditType="wysiwyg"
//                     useCommandShortcut
//                 />
//             </div>}
//         </div>
//     );
// };

// export default Page;



"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import templates from "@/utls/templates";
import { marked } from "marked";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/ui/SubmitButton";
import { generateAndSave } from "@/app/actions/query";
import { useUsage } from "@/context/usage";

import dynamic from "next/dynamic";

// ⚡ Dynamic import for React Quill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Quill CSS

const initialState = {
    result: "",
    error: null,
};

const Page = ({ params }) => {
    const { data: session } = useSession();
    const user = session?.user;

    const { subscribed, count, fetchUsage } = useUsage();

    const [query, setQuery] = useState("");
    const [editorContent, setEditorContent] = useState(""); // controlled editor

    const selectedTemplate = templates.find((t) => t.slug === params.slug);

    const [state, formAction] = useFormState(generateAndSave, initialState);

    // update editor when result changes
    useEffect(() => {
        if (state.result) {
            // Convert Markdown to HTML for React Quill
            const html = marked(state.result);
            setEditorContent(html);
        }

        if (state.error) {
            toast.error(state.error);
        }

        if (state.result) {
            toast.success("Content generated & saved");
            fetchUsage();
        }
    }, [state]);
    // React Quill toolbar configuration
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image",];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
            {/* LEFT PANEL */}
            <div className="col-span-1 bg-slate-100 dark:bg-slate-900 rounded-md border p-5">
                <div className="flex flex-col gap-3">
                    <Image
                        src={selectedTemplate.icon}
                        alt={selectedTemplate.name}
                        width={50}
                        height={50}
                    />
                    <h2 className="font-medium text-lg">{selectedTemplate.name}</h2>
                    <p className="text-gray-500">{selectedTemplate.desc}</p>
                </div>

                {/* ONE FORM — ONE BUTTON */}
                <form action={formAction} className="mt-6">
                    <input type="hidden" name="templateSlug" value={selectedTemplate.slug} />
                    <input type="hidden" name="email" value={user?.email || ""} />

                    {selectedTemplate.form.map((item) => (
                        <div key={item.name} className="my-2 flex flex-col gap-2 mb-7">
                            <label className="font-bold pb-2">{item.label}</label>
                            {item.field === "input" ? (
                                <Input
                                    name={item.name}
                                    required={item.required}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            ) : (
                                <Textarea
                                    name={item.name}
                                    required={item.required}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            )}
                        </div>
                    ))}

                    <SubmitButton subscribed={subscribed} count={count}>Generate Content</SubmitButton>
                </form>
            </div>

            {/* RIGHT PANEL */}
            <div className="mt-6 p-4 md:col-span-2">
                <ReactQuill
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    placeholder="Generated content will appear here..."
                    style={{ height: "600px" }}
                />
            </div>
        </div>
    );
};

export default Page;