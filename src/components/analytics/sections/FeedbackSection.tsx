
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackEntry {
  name: string;
  rating: number;
  comment: string;
  date: string;
  session: string;
}

interface FeedbackSectionProps {
  feedback: FeedbackEntry[];
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedback }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.map((entry, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <h4 className="font-medium">{entry.name}</h4>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${star <= entry.rating ? "text-yellow-500" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm mt-2">"{entry.comment}"</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {entry.date} - {entry.session}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
