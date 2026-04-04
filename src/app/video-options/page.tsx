import { SourceOptionsForm } from '@/components/auth';

export default function VideoOptionsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Mobile App Style Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-900">Video Options</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div className="max-w-[500px] w-full">
          <SourceOptionsForm />
        </div>
      </div>
    </div>
  );
}
