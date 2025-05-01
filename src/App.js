import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  // Tema değişikliği için state
  const [darkMode, setDarkMode] = useState(true);

  // Tema değişikliğini local storage'a kaydet
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Tema değişikliğini takip et
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Kategoriler
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [{ id: 1, name: "Genel" }];
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    return savedCategory ? JSON.parse(savedCategory) : 1;
  });
  const [categorySearch, setCategorySearch] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Tasklar
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskFilter, setTaskFilter] = useState(() => {
    const savedFilter = localStorage.getItem('taskFilter');
    return savedFilter ? JSON.parse(savedFilter) : 'all';
  });

  // Notlar için modal state
  const [noteModal, setNoteModal] = useState({ open: false, idx: null });
  const [noteValue, setNoteValue] = useState('');

  // localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('taskFilter', JSON.stringify(taskFilter));
  }, [taskFilter]);

  // Kategori filtreleme
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Task filtreleme
  const filteredTodos = todos
    .filter(todo =>
      (selectedCategory === 0 || todo.categoryId === selectedCategory) &&
      todo.text.toLowerCase().includes(taskSearch.toLowerCase()) &&
      (
        taskFilter === 'all' ||
        (taskFilter === 'done' && todo.done) ||
        (taskFilter === 'undone' && !todo.done)
      )
    );

  // Görev ekle
  const addTodo = () => {
    if (input.trim() !== '') {
      setTodos([
        ...todos,
        { text: input, done: false, categoryId: selectedCategory, note: '' }
      ]);
      setInput('');
    }
  };

  // Görev sil
  const deleteTodo = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
  };

  // Görev tamamlandı toggle
  const toggleTodo = (idx) => {
    setTodos(todos.map((todo, i) =>
      i === idx ? { ...todo, done: !todo.done } : todo
    ));
  };

  // Görev düzenle
  const saveEdit = (idx) => {
    if (editValue.trim() !== '') {
      setTodos(todos.map((todo, i) =>
        i === idx ? { ...todo, text: editValue } : todo
      ));
      setEditIndex(null);
      setEditValue('');
    }
  };

  // Kategori ekle
  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.some(cat => cat.name === trimmed)) {
      const newId = Math.max(...categories.map(cat => cat.id), 0) + 1;
      setCategories([...categories, { id: newId, name: trimmed }]);
      setNewCategory('');
    }
  };

  // Kategori sil
  const deleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setTodos(todos.filter(todo => todo.categoryId !== id));
    if (selectedCategory === id) setSelectedCategory(1);
  };

  // Not modalını aç
  const openNoteModal = (idx) => {
    setNoteModal({ open: true, idx });
    setNoteValue(todos[idx]?.note || '');
  };

  // Notu kaydet
  const saveNote = () => {
    setTodos(todos.map((todo, i) =>
      i === noteModal.idx ? { ...todo, note: noteValue } : todo
    ));
    setNoteModal({ open: false, idx: null });
    setNoteValue('');
  };

  // Not modalını kapat
  const closeNoteModal = () => {
    setNoteModal({ open: false, idx: null });
    setNoteValue('');
  };

  return (
    <div className={`todo-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Üst bar */}
      <div className="todo-header-row">
        <img className={`logo-mini ${darkMode ? 'dark-theme' : 'light-theme'}`} src="logo.png" alt="Logo" />
        <div className="theme-social-container">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title={darkMode ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="social-links social-mini">
            <a
              href="https://github.com/muratalpaslan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.72 0 .27.17.58.68.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/muratalpaslan/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="4" />
                <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z"/>
                <circle cx="8" cy="8" r="2"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Başlık */}
      <h1 className="todo-title">OmniTask</h1>

      {/* Kategori Alanı */}
      <div className="category-section">
        <input
          type="text"
          placeholder="Kategori ara..."
          value={categorySearch}
          onChange={e => setCategorySearch(e.target.value)}
          className={darkMode ? 'dark-theme' : 'light-theme'}
        />
        <ul className="category-list">
          {filteredCategories.map(cat => (
            <li
              key={cat.id}
              className={selectedCategory === cat.id ? "selected" : ""}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
              {cat.id !== 1 && (
                <button onClick={e => { e.stopPropagation(); deleteCategory(cat.id); }}>✖</button>
              )}
            </li>
          ))}
        </ul>
        <div className="add-category">
          <input
            type="text"
            placeholder="Yeni kategori"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            className={darkMode ? 'dark-theme' : 'light-theme'}
          />
          <button onClick={addCategory} className={darkMode ? 'dark-theme' : 'light-theme'}>Ekle</button>
        </div>
      </div>

      {/* Görevler */}
      <div className="todo-section">
        <div className="todo-controls">
          <input
            type="text"
            placeholder="Görev ara..."
            value={taskSearch}
            onChange={e => setTaskSearch(e.target.value)}
            className={darkMode ? 'dark-theme' : 'light-theme'}
          />
          <div className="select-wrapper">
            <select
              className={`task-filter ${darkMode ? 'dark-theme' : 'light-theme'}`}
              value={taskFilter}
              onChange={e => setTaskFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="done">Tamamlananlar</option>
              <option value="undone">Yapılacaklar</option>
            </select>
            <FontAwesomeIcon icon={faAngleDown} className={`select-icon ${darkMode ? 'dark-theme' : 'light-theme'}`} />
          </div>
        </div>
        <ul className="todo-list">
          {filteredTodos.map((todo, idx) => (
            <li key={idx} className={`${todo.done ? "done" : ""} ${darkMode ? 'dark-theme' : 'light-theme'}`}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todos.indexOf(todo))}
                className={darkMode ? 'dark-theme' : 'light-theme'}
              />
              {editIndex === todos.indexOf(todo) ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(todos.indexOf(todo))}
                    className={darkMode ? 'dark-theme' : 'light-theme'}
                  />
                  <button onClick={() => saveEdit(todos.indexOf(todo))} className={darkMode ? 'dark-theme' : 'light-theme'}>Kaydet</button>
                </>
              ) : (
                <>
                  <span>{todo.text}</span>
                  <button
                    title="Notlar"
                    onClick={() => openNoteModal(todos.indexOf(todo))}
                    className={darkMode ? 'dark-theme' : 'light-theme'}
                    style={{ marginLeft: 4 }}
                  >📝</button>
                  <button
                    onClick={() => { setEditIndex(todos.indexOf(todo)); setEditValue(todo.text); }}
                    className={darkMode ? 'dark-theme' : 'light-theme'}
                  >✏️</button>
                  <button
                    onClick={() => deleteTodo(todos.indexOf(todo))}
                    className={darkMode ? 'dark-theme' : 'light-theme'}
                  >🗑️</button>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="add-todo">
          <input
            type="text"
            placeholder="Yeni görev ekle"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            className={darkMode ? 'dark-theme' : 'light-theme'}
          />
          <button onClick={addTodo} className={darkMode ? 'dark-theme' : 'light-theme'}>Ekle</button>
        </div>
      </div>

      {/* Notlar Modalı */}
      {noteModal.open && (
        <div className={`note-modal-backdrop ${darkMode ? 'dark-theme' : 'light-theme'}`} onClick={closeNoteModal}>
          <div className={`note-modal ${darkMode ? 'dark-theme' : 'light-theme'}`} onClick={e => e.stopPropagation()}>
            <h3>Notlar</h3>
            <textarea
              value={noteValue}
              onChange={e => setNoteValue(e.target.value)}
              placeholder="Bu göreve not ekleyin..."
              rows={5}
              autoFocus
              className={darkMode ? 'dark-theme' : 'light-theme'}
            />
            <div className="note-modal-actions">
              <button onClick={saveNote} className={darkMode ? 'dark-theme' : 'light-theme'}>Kaydet</button>
              <button onClick={closeNoteModal} className={`modal-close-btn ${darkMode ? 'dark-theme' : 'light-theme'}`}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;