// Database simulation with multiple SQL injection vulnerabilities

export class VulnerableDatabase {
  // Simulate database connection
  private connection = {
    query: (sql: string) => {
      console.log('Executing SQL:', sql);
      return { sql, rows: [] };
    }
  };

  // SQL injection in login function
  authenticate(username: string, password: string) {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    return this.connection.query(query);
  }

  // SQL injection in search function
  searchUsers(searchTerm: string) {
    const query = `SELECT * FROM users WHERE name LIKE '%${searchTerm}%'`;
    return this.connection.query(query);
  }

  // SQL injection in user creation
  createUser(userData: any) {
    const query = `INSERT INTO users (name, email, role) VALUES ('${userData.name}', '${userData.email}', '${userData.role}')`;
    return this.connection.query(query);
  }

  // SQL injection in dynamic table queries
  getTableData(tableName: string, condition: string) {
    const query = `SELECT * FROM ${tableName} WHERE ${condition}`;
    return this.connection.query(query);
  }

  // SQL injection in ORDER BY clause
  getUsersSorted(sortBy: string, order: string) {
    const query = `SELECT * FROM users ORDER BY ${sortBy} ${order}`;
    return this.connection.query(query);
  }

  // SQL injection in LIMIT clause
  getUsersWithLimit(limit: string, offset: string) {
    const query = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;
    return this.connection.query(query);
  }

  // SQL injection in subquery
  getUsersByRole(role: string) {
    const query = `SELECT * FROM users WHERE id IN (SELECT user_id FROM user_roles WHERE role = '${role}')`;
    return this.connection.query(query);
  }

  // SQL injection in UNION attack
  getUserDetails(userId: string) {
    const query = `SELECT name, email FROM users WHERE id = ${userId}`;
    return this.connection.query(query);
  }

  // SQL injection in batch operations
  deleteBatch(ids: string) {
    const query = `DELETE FROM users WHERE id IN (${ids})`;
    return this.connection.query(query);
  }

  // SQL injection in stored procedure call
  callProcedure(procName: string, params: string) {
    const query = `CALL ${procName}(${params})`;
    return this.connection.query(query);
  }
}

// Export vulnerable database instance
export const vulnerableDB = new VulnerableDatabase();

// Direct SQL execution functions
export function executeRawSQL(sql: string) {
  console.log('Executing raw SQL:', sql);
  return vulnerableDB['connection'].query(sql);
}

export function buildComplexQuery(table: string, columns: string, where: string, groupBy: string, having: string, orderBy: string) {
  const query = `SELECT ${columns} FROM ${table} WHERE ${where} GROUP BY ${groupBy} HAVING ${having} ORDER BY ${orderBy}`;
  return executeRawSQL(query);
}
