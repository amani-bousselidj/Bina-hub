import React from 'react';

export const SingleColumnPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

interface TwoColumnPageProps {
  children: React.ReactNode;
  data?: any;
  hasOutlet?: boolean;
  showJSON?: boolean;
  showMetadata?: boolean;
  widgets?: any;
}

const TwoColumnPageComponent = ({ children, data, hasOutlet, showJSON, showMetadata, widgets }: TwoColumnPageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {children}
      </div>
      {showJSON && data && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-medium">Show JSON Data</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {children}
    </div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      {children}
    </div>
  );
};

export const TwoColumnPage = Object.assign(TwoColumnPageComponent, {
  Main,
  Sidebar,
});




