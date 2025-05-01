import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      <h2 className="text-2xl font-bold">Страница не найдена</h2>
      <p className="mt-4">Извините, запрашиваемая страница не существует</p>
      <Link 
        href="/"
        className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Вернуться на главную
      </Link>
    </div>
  )
} 