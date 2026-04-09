// "use client";

// import React, { useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import { toast } from "sonner";
// import { updateQuery } from "@/app/actions/query";
// import { Button } from "@/components/ui/button";

// const Editor = dynamic(
//     () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
//     { ssr: false }
// );

// const EditClient = ({ queryData }) => {

//     const editorRef = useRef("");
//     const [loading, setLoading] = useState(false);

//     const handleUpdate = async () => {
//         if (loading) return
//         const editorInstance = editorRef.current.getInstance();
//         const content = editorInstance.getMarkdown();

//         setLoading(true);
//         const res = await updateQuery({
//             id: queryData._id,
//             content,
//         });

//         if (res?.error) {
//             toast.error(res.error);
//         } else {
//             toast.success("Updated successfully");
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="p-5">
//             <h2 className="text-xl font-semibold mb-4">Edit Content</h2>

//             <Editor
//                 key={queryData._id + queryData.content.length}
//                 ref={editorRef}
//                 initialValue={queryData.content || "loading...."}
//                 previewStyle="vertical"
//                 height="600px"
//                 initialEditType="wysiwyg"
//             />

//             <Button
//                 onClick={handleUpdate}
//                 disabled={loading}
//                 className="mt-4"
//             >
//                 {loading ? "Updating..." : "Update"}
//             </Button>
//         </div>
//     );
// };

// export default EditClient;

// "use client";

// import React, { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { toast } from "sonner";
// import { updateQuery } from "@/app/actions/query";
// import { Button } from "@/components/ui/button";

// // ⚡ Dynamic import to avoid SSR issues
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// // ⚡ Include Quill CSS
// import "react-quill/dist/quill.snow.css";

// const EditClient = ({ queryData }) => {
//     const [content, setContent] = useState("");
//     const [loading, setLoading] = useState(false);

//     // Initialize content once
//     useEffect(() => {
//         setContent(queryData.content || "");
//     }, [queryData.content]);

//     const handleUpdate = async () => {
//         if (loading) return;

//         setLoading(true);

//         const res = await updateQuery({
//             id: queryData._id,
//             content,
//         });

//         setLoading(false);

//         if (res?.error) {
//             toast.error(res.error);
//         } else {
//             toast.success("Updated successfully");
//         }
//     };

//     // Quill toolbar options
//     const modules = {
//         toolbar: [
//             [{ header: [1, 2, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             ["clean"],
//         ],
//     };

//     const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image",];

//     return (
//         <>
//             <div className="p-5">
//                 <h2 className="text-xl font-semibold mb-4">Edit Content</h2>

//                 <ReactQuill
//                     value={content}
//                     onChange={setContent}
//                     modules={modules}
//                     formats={formats}
//                     theme="snow"
//                     placeholder="Start editing..."
//                     style={{ height: "400px", marginBottom: "20px" }}
//                 />

//             </div>
//             <Button onClick={handleUpdate} disabled={loading} className="mt-3">
//                 {loading ? "Updating..." : "Update"}
//             </Button>
//         </>
//     );
// };

// export default EditClient;


"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { updateQuery } from "@/app/actions/query";
import { Button } from "@/components/ui/button";
import { marked } from "marked"; // ⚡ convert Markdown -> HTML

// Dynamic import for React Quill (no SSR)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const EditClient = ({ queryData }) => {
    const [content, setContent] = useState(""); // HTML for Quill
    const [loading, setLoading] = useState(false);

    // Convert Markdown from DB to HTML when initializing editor
    useEffect(() => {
        if (queryData.content) {
            setContent(marked.parse(queryData.content));
        }
    }, [queryData.content]);

    const handleUpdate = async () => {
        if (loading) return;

        setLoading(true);

        const res = await updateQuery({
            id: queryData._id,
            content,
        });

        setLoading(false);

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success("Updated successfully");
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
    ];

    return (
        <>
            <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">Edit Content</h2>

                <ReactQuill
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    placeholder="Start editing..."
                    style={{ height: "400px", marginBottom: "20px" }}
                />
            </div>

            <Button onClick={handleUpdate} disabled={loading} className="m-3">
                {loading ? "Updating..." : "Update"}
            </Button>
        </>
    );
};

export default EditClient;