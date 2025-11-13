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
import { KEYPOINTS_MAPPING, KeypointName, CustomPoseConfig } from '@/lib/pose-constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

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

type AngleRule = {
  id: number;
  name: string;
  p1: KeypointName;
  p2: KeypointName;
  p3: KeypointName;
  target: number;
  tolerance: number;
  feedback_low: string;
  feedback_high: string;
  feedback_good: string;
};

export function AddPoseForm({ children, onAddPose }: AddPoseFormProps) {
  const [isOpen, setOpen] = useState(false);
  const [poseName, setPoseName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [angleRules, setAngleRules] = useState<AngleRule[]>([]);

  const keypointOptions = Object.keys(KEYPOINTS_MAPPING) as KeypointName[];

  const handleAddRule = () => {
    setAngleRules([
      ...angleRules,
      {
        id: Date.now(),
        name: `joint_angle_${angleRules.length + 1}`,
        p1: 'nose', p2: 'left_shoulder', p3: 'left_elbow',
        target: 180,
        tolerance: 15,
        feedback_low: '',
        feedback_high: '',
        feedback_good: '',
      },
    ]);
  };

  const handleRemoveRule = (id: number) => {
    setAngleRules(angleRules.filter(rule => rule.id !== id));
  };

  const handleRuleChange = (id: number, field: keyof Omit<AngleRule, 'id'>, value: string | number) => {
    setAngleRules(
      angleRules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const handleSubmit = () => {
    if (!poseName || !description || !imageUrl) {
        // Maybe show a toast here later
        return;
    }

    const config: CustomPoseConfig = angleRules.reduce((acc, rule) => {
      acc[rule.name] = {
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
      id: poseName.replace(/\s+/g, '_'),
      description,
      imageUrl,
      config,
    };

    onAddPose(newPose);
    setOpen(false);
    // Reset form
    setPoseName('');
    setDescription('');
    setImageUrl('');
    setAngleRules([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Custom Pose</DialogTitle>
          <DialogDescription>
            Define a new yoga pose by providing its details and analysis rules.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Pose Name
            </Label>
            <Input id="name" value={poseName} onChange={(e) => setPoseName(e.target.value)} className="col-span-3" placeholder="e.g., Happy Baby" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="How to perform the pose." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" placeholder="https://example.com/image.jpg"/>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Pose Analysis Rules</h4>
            <div className="space-y-4">
                {angleRules.map((rule) => (
                    <div key={rule.id} className="p-4 border rounded-md relative">
                         <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleRemoveRule(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Rule Name</Label>
                                <Input value={rule.name} onChange={e => handleRuleChange(rule.id, 'name', e.target.value)} placeholder="e.g., knee_angle" />
                            </div>
                            <div>
                                <Label>Target Angle (°)</Label>
                                <Input type="number" value={rule.target} onChange={e => handleRuleChange(rule.id, 'target', e.target.value)} />
                            </div>
                            <div>
                                <Label>Tolerance (°)</Label>
                                <Input type="number" value={rule.tolerance} onChange={e => handleRuleChange(rule.id, 'tolerance', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                             <div>
                                <Label>Point 1 (p1)</Label>
                                <Select value={rule.p1} onValueChange={(v) => handleRuleChange(rule.id, 'p1', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {keypointOptions.map(kp => <SelectItem key={kp} value={kp}>{kp}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Center Point (p2)</Label>
                                <Select value={rule.p2} onValueChange={(v) => handleRuleChange(rule.id, 'p2', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {keypointOptions.map(kp => <SelectItem key={kp} value={kp}>{kp}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Point 3 (p3)</Label>
                                <Select value={rule.p3} onValueChange={(v) => handleRuleChange(rule.id, 'p3', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {keypointOptions.map(kp => <SelectItem key={kp} value={kp}>{kp}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="mt-4 space-y-2">
                             <Label>Feedback Messages</Label>
                             <Input placeholder="Feedback for angle too low" value={rule.feedback_low} onChange={e => handleRuleChange(rule.id, 'feedback_low', e.target.value)} />
                             <Input placeholder="Feedback for angle too high" value={rule.feedback_high} onChange={e => handleRuleChange(rule.id, 'feedback_high', e.target.value)} />
                             <Input placeholder="Feedback for good angle" value={rule.feedback_good} onChange={e => handleRuleChange(rule.id, 'feedback_good', e.target.value)} />
                         </div>
                    </div>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleAddRule} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Angle Rule
            </Button>
          </div>
        </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Pose</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
