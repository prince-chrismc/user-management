export const EditUser = async (id, name, email) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email })
    };

    return await fetch('https://localhost:8080/um/v1/users/' + id, requestOptions)
        .then(res => (res.ok ? res : Promise.reject(res)))
        .then(res => res.json())
}

export const DeleteUser = async (id) => {
    const requestOptions = {
      method: 'DELETE',
    };
    return await fetch('https://localhost:8080/um/v1/users/' + id, requestOptions)
        .then(res => (res.ok ? res : Promise.reject(res)))
}