import axios from 'axios'
import { API_URL } from '../config/api'
import { getAuthHeaders } from './auth'

/**
 * JSON Field Definitions API Service
 * Handles all API operations for JSON field definitions
 */
class JsonFieldsService {
  constructor() {
    this.baseUrl = `${API_URL}/json-field-definitions`
  }

  /**
   * Get all JSON field definitions with optional filters and pagination
   * @param {Object} params - Query parameters (search, table_name, page, per_page)
   * @returns {Promise<Object>} API response with data and meta information
   */
  async getAll(params = {}) {
    try {
      const headers = await getAuthHeaders()
      const queryParams = new URLSearchParams()
      
      // Add parameters if they exist
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key])
        }
      })
      
      const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl
      const response = await axios.get(url, { headers })
      
      return response.data
    } catch (error) {
      console.error('Error fetching JSON field definitions:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get a single JSON field definition by ID
   * @param {number} id - The field definition ID
   * @returns {Promise<Object>} API response with field definition data
   */
  async getById(id) {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.get(`${this.baseUrl}/${id}`, { headers })
      
      return response.data
    } catch (error) {
      console.error(`Error fetching JSON field definition ${id}:`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Create a new JSON field definition
   * @param {Object} data - Field definition data
   * @param {string} data.table_name - Database table name
   * @param {string} data.column_name - Column name in the table
   * @param {string} data.key - JSON key
   * @param {string} data.value - JSON value
   * @param {string} [data.description] - Optional description
   * @returns {Promise<Object>} API response with created field definition
   */
  async create(data) {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.post(this.baseUrl, data, { headers })
      
      return response.data
    } catch (error) {
      console.error('Error creating JSON field definition:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Bulk create multiple JSON field definitions
   * @param {Object} data - Bulk creation data
   * @param {Array} data.definitions - Array of field definitions
   * @returns {Promise<Object>} API response with created field definitions
   */
  async bulkCreate(data) {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.post(`${this.baseUrl}/bulk`, data, { headers })
      
      return response.data
    } catch (error) {
      console.error('Error bulk creating JSON field definitions:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update an existing JSON field definition
   * @param {number} id - The field definition ID
   * @param {Object} data - Updated field definition data
   * @returns {Promise<Object>} API response with updated field definition
   */
  async update(id, data) {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.put(`${this.baseUrl}/${id}`, data, { headers })
      
      return response.data
    } catch (error) {
      console.error(`Error updating JSON field definition ${id}:`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete a JSON field definition
   * @param {number} id - The field definition ID
   * @returns {Promise<Object>} API response confirming deletion
   */
  async delete(id) {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.delete(`${this.baseUrl}/${id}`, { headers })
      
      return response.data
    } catch (error) {
      console.error(`Error deleting JSON field definition ${id}:`, error)
      throw this.handleError(error)
    }
  }

  /**
   * Bulk delete JSON field definitions
   * @param {Array<number>} ids - Array of field definition IDs
   * @returns {Promise<Object>} API response confirming bulk deletion
   */
  async bulkDelete(ids) {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.delete(`${this.baseUrl}/bulk`, {
        headers,
        data: { ids }
      })
      
      return response.data
    } catch (error) {
      console.error('Error bulk deleting JSON field definitions:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get unique table names for filtering
   * @returns {Promise<Array<string>>} Array of unique table names
   */
  async getUniqueTables() {
    try {
      const headers = await getAuthHeaders()
      const response = await axios.get(`${this.baseUrl}/tables`, { headers })
      
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching unique tables:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Validate field definition data
   * @param {Object} data - Field definition data to validate
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  validateData(data) {
    const errors = []
    
    if (!data.table_name || data.table_name.trim() === '') {
      errors.push('Table name is required')
    }
    
    if (!data.column_name || data.column_name.trim() === '') {
      errors.push('Column name is required')
    }
    
    if (!data.key || data.key.trim() === '') {
      errors.push('Key is required')
    }
    
    if (!data.value || data.value.trim() === '') {
      errors.push('Value is required')
    }
    
    // Additional validation rules can be added here
    if (data.table_name && data.table_name.length > 255) {
      errors.push('Table name must be less than 255 characters')
    }
    
    if (data.column_name && data.column_name.length > 255) {
      errors.push('Column name must be less than 255 characters')
    }
    
    if (data.key && data.key.length > 255) {
      errors.push('Key must be less than 255 characters')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - The error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'An error occurred'
      const statusCode = error.response.status
      
      const formattedError = new Error(message)
      formattedError.statusCode = statusCode
      formattedError.response = error.response.data
      
      return formattedError
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: No response from server')
    } else {
      // Something else happened
      return error
    }
  }
}

// Export singleton instance
export default new JsonFieldsService()

// Export class for testing or multiple instances if needed
export { JsonFieldsService }
