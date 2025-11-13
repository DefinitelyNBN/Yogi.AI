'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomPoseConfig, KEYPOINTS_MAPPING } from '@/lib/pose-constants';
import { Loader } from 'lucide-react';
import { getAIPoseRules } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface AddPoseFormProps {
  children: React.ReactNode;
  onAddPose: (newPose: {
    name: string;
    id: string;
    description: string;
    imageUrl: string;
    config: CustomPoseConfig;
  }) => void;
}

export function AddPoseForm({ children, onAddPose }: AddPoseFormProps) {
  const { toast } = useToast();
  const [isOpen, setOpen] = useState(false);
  const [poseName, setPoseName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setPoseName('');
    setDescription('');
    setImageUrl('');
    setIsSaving(false);
  }

  const handleSubmit = async () => {
    if (!poseName || !description || !imageUrl) {
        toast({
            variant: "destructive",
            title: "Missing fields",
            description: "Please fill out the pose name, description, and image URL."
        })
        return;
    }

    setIsSaving(true);

    // Generate rules with AI
    const aiResult = await getAIPoseRules({ poseName, poseDescription: description });

    if (!aiResult.success || !aiResult.rules) {
        toast({
            variant: 'destructive',
            title: 'AI Generation Failed',
            description: aiResult.error || 'Could not generate analysis rules. Please try again.',
        });
        setIsSaving(false);
        return;
    }

    // Convert the AI-generated rules into the CustomPoseConfig format
    const config: CustomPoseConfig = Object.entries(aiResult.rules).reduce((acc, [name, rule]) => {
      acc[name] = {
        p1: KEYPOINTS_MAPPING[rule.p1],
        p2: KEYPOINTS_MAPPING[rule.p2],
        p3: KEYPOINTS_MAPPING[rule.p3],
        target: Number(rule.target),
        tolerance: Number(rule.tolerance),
        feedback_low: rule.feedback_low,
        feedback_high: rule.feedback_high,
        feedback_good: rule.feedback_good,
      };
      return acc;
    }, {} as CustomPoseConfig);


    const newPose = {
      name: poseName,
      id: poseName.replace(/\s+/g, '_').toLowerCase(),
      description,
      imageUrl,
      config,
    };

    onAddPose(newPose);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
      }
      setOpen(open)
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Custom Pose</DialogTitle>
          <DialogDescription>
            Provide the details for a new yoga pose. AI will automatically generate the analysis rules for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Pose Name
            </Label>
            <Input id="name" value={poseName} onChange={(e) => setPoseName(e.target.value)} className="col-span-3" placeholder="e.g., Happy Baby" disabled={isSaving}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="A detailed description of how to perform the pose." disabled={isSaving}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" placeholder="https://example.com/image.jpg" disabled={isSaving}/>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Save Pose
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
