const API_BASE_URL = "https://notes-api.dicoding.dev/v1";

export const login = (data, callback) => {
  fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal melakukan login.");
      }
      return response.json();
    })
    .then((responseData) => {
      if (responseData.data && responseData.data.accessToken) {
        callback(true, responseData.data.accessToken);
      } else {
        throw new Error("Token tidak ditemukan pada respons.");
      }
    })
    .catch((error) => {
      callback(false, error);
    });
};

export const register = (data, callback) => {
  fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errData) => {
          throw new Error(errData.message || "Gagal melakukan registrasi.");
        });
      }
      return response.json();
    })
    .then((responseData) => {
      callback(true, responseData);
    })
    .catch((error) => {
      callback(false, error);
    });
};

export const getUserLoggedIn = (callback) => {
  const token = localStorage.getItem("token");
  if (!token) {
    callback(false, "Token not found");
    return;
  }

  fetch("https://notes-api.dicoding.dev/v1/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal mengambil data pengguna.");
      }
      return response.json();
    })
    .then((responseData) => {
      if (responseData.data) {
        callback(true, responseData.data);
      } else {
        throw new Error("Format data tidak sesuai.");
      }
    })
    .catch((error) => {
      callback(false, error);
    });
};
