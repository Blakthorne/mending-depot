/**
 * Define a general layout for forms to be used in
 * @returns HTML form layout
 */
export default function FormLayout({ children, formTitle }: {
    children: React.ReactNode,
    formTitle: string,
    }) {
    return (
        <div className="flex flex-col">
            <div className="text-3xl text-center tracking-wide">{formTitle}</div>
            <div className=" mx-auto px-2 mt-16 mb-16">
                {children}
            </div>
        </div>
    )
}