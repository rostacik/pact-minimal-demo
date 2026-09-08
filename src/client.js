export class UserClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getUser(id) {
    const response = await fetch(`${this.baseUrl}/users/${id}`);

    if (!response.ok) {
      throw new Error(`User request failed with status ${response.status}`);
    }

    return response.json();
  }
}
