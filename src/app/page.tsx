import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Personal Todo List
          </h1>
          <p className="text-gray-400 text-lg">
            Stay organized and track your tasks
          </p>
        </header>
        
        <main>
          <TodoList />
        </main>
      </div>
    </div>
  );
}
