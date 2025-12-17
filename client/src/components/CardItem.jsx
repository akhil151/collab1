import PropTypes from "prop-types"

export default function CardItem({ card }) {
  return (
    <div className="bg-white rounded-2xl p-4 cursor-move transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border border-slate-200/50 hover:border-slate-300 animate-fade-in">
      <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2">
        {card.title}
      </h4>
      {card.description && (
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
          {card.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50">
        <div className="flex -space-x-2">
          {card.assignees?.slice(0, 3).map((assignee) => (
            <div
              key={assignee._id}
              className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white hover:scale-125 transition-transform cursor-pointer"
              title={assignee.name}
            >
              {assignee.name?.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        {card.dueDate && (
          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg font-medium">
            {new Date(card.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  )
}

CardItem.propTypes = {
  card: PropTypes.object.isRequired
}
