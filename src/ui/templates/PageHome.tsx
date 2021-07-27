import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode;
  children: React.ReactNode[];
}

export function PageHome ({ header, children: [content, ...aside] }: Props): React.ReactElement<Props> {
  return (
    <>
      <div className="w-full mx-auto overflow-y-auto">
        <div className="grid max-w-6xl lg:grid-cols-12 gap-5 px-5 py-3 m-2">
          <main className="lg:col-span-8 p-4">
            <div className="space-y-1 pb-1">
              <h1 className="text-lg pb-2 dark:text-white text-gray-700">
                {header}
              </h1>
            </div>
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  {content}
                </div>
              </div>
            </div>
          </main>
          <aside className="flex-none md:max-w-sm" style={{minWidth: "360px"}}>
            {...aside}
          </aside>
        </div>
      </div>
    </>
  );
}
