const Code = ({ children, language = 'javascript' }) => {
    return (
        <div className="overflow-x-auto">
            <pre className={`text-slate-200 bg-slate-700 w-50 rounded-md p-4 font-mono text-lg language-${language}`}>
                <code>{children}</code>
            </pre>
        </div>
    )
}
