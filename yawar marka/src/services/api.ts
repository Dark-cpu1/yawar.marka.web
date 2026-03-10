const API_URL = import.meta.env.VITE_API_URL

export const apiService = {
  login: (email: string, password: string) =>
    fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).then(res => res.json()),

  register: (nombre: string, email: string, password: string) =>
    fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    }).then(res => res.json()),

  getUsers: () =>
    fetch(`${API_URL}/api/users`).then(res => res.json()),

  getInformes: () =>
    fetch(`${API_URL}/api/informes`).then(res => res.json()),
}
