function NumberedListIcon() {
  return (
    <div className="rbt-w-full rbt-h-full rbt-flex rbt-items-center rbt-justify-center rbt-gap-1">
      <div className="rbt-text-lg rbt-text-gray-600 rbt-font-mono">
        1
        <span className="rbt-font-sans">
          .
        </span>
      </div>
      <div className="rbt-grow rbt-flex rbt-flex-col rbt-gap-[0.2rem] -rbt-mr-1">
        <div className="rbt-border-b rbt-border-gray-300" />
        <div className="rbt-w-[50%] rbt-border-b rbt-border-gray-300" />
        <div className="rbt-w-[75%] rbt-border-b rbt-border-gray-300" />
      </div>
    </div>
  )
}

export default NumberedListIcon
