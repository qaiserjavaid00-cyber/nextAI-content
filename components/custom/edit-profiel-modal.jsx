"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/app/actions/password";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditProfileModal({ user, setUser }) {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Read file as data URL if selected
            let imageDataUrl = null;
            if (imageFile) {
                imageDataUrl = await toBase64(imageFile);
            }

            // Call server action
            const updated = await updateUserProfile(user.id, {
                username,
                email,
                imageFile: imageDataUrl,
            });

            toast.success("Profile updated!");
            setUser(updated); // update parent
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label>Username</label>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Email</label>
                        <Input value={email} type="email" disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Profile Image</label>
                        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full mt-2">
                        {loading ? <div className="flex gap-2"><Loader2 className="animate-spin" /><span>Updating</span></div> : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}