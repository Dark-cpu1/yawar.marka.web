const API_URL = import.meta.env.VITE_API_URL || "https://yawarmarkaweb-production-1701.up.railway.app";

console.log("Conectando a:", API_URL);

export const apiService = {
  // --- AUTENTICACIÓN (Se mantiene igual) ---
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

  // --- USUARIOS ---
  getUsers: () =>
    fetch(`${API_URL}/api/users`).then(res => res.json()),

  deleteUser: (id: number) =>
    fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" }).then(res => res.json()),

  updateRol: (id: number, rol: string) =>
    fetch(`${API_URL}/api/users/${id}/rol`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rol })
    }).then(res => res.json()),

  // --- INFORMES ---
  getInformes: () =>
    fetch(`${API_URL}/api/informes`).then(res => res.json()),

  // Para crear informes con archivos ( FormData )
  createInforme: (formData: FormData) =>
    fetch(`${API_URL}/api/informes`, {
      method: "POST",
      body: formData
    }).then(res => res.json()),

  deleteInforme: (id: number) =>
    fetch(`${API_URL}/api/informes/${id}`, { method: "DELETE" }).then(res => res.json()),

  // --- REACCIONES ---
  getReacciones: (informeId: number) =>
    fetch(`${API_URL}/api/reacciones/${informeId}`).then(res => res.json()),

  postReaccion: (informe_id: number, usuario_id: number, tipo: string) =>
    fetch(`${API_URL}/api/reacciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ informe_id, usuario_id, tipo })
    }).then(res => res.json()),

  // --- COMENTARIOS ---
  getComentarios: (informeId: number) =>
    fetch(`${API_URL}/api/comentarios/${informeId}`).then(res => res.json()),

  postComentario: (informe_id: number, usuario_id: number, comentario: string) =>
    fetch(`${API_URL}/api/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ informe_id, usuario_id, comentario })
    }).then(res => res.json()),
};