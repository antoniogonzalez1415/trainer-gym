import { plateClass } from '../utils/categories.js'

export default function CategoryTag({ category }) {
  return (
    <span className={`category-tag ${plateClass(category)}`}>
      <span className="plate-dot" aria-hidden="true" />
      {category}
    </span>
  )
}
