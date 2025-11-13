import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="profile-form"
export default class extends Controller {
  static targets = ["form", "alerts"]

  async submit(event) {
    event.preventDefault()
    
    const formData = new FormData(this.formTarget)
    const submitButton = this.formTarget.querySelector('input[type="submit"]')
    const originalText = submitButton.value
    
    // Disable submit button
    submitButton.disabled = true
    submitButton.value = 'Updating...'
    
    try {
      const response = await fetch(this.formTarget.action, {
        method: 'PATCH',
        body: formData,
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
          'Accept': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        this.showSuccess(data.message)
        this.autoCloseModal()
      } else {
        this.showErrors(data.errors || ['An error occurred'])
      }
    } catch (error) {
      this.showErrors(['An unexpected error occurred. Please try again.'])
    } finally {
      // Re-enable submit button
      submitButton.disabled = false
      submitButton.value = originalText
    }
  }

  showSuccess(message) {
    this.alertsTarget.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="bi bi-check-circle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `
  }

  showErrors(errors) {
    this.alertsTarget.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        <strong>Update failed:</strong>
        <ul class="mb-0 mt-2">
          ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `
  }

  autoCloseModal() {
    setTimeout(() => {
      const modalElement = document.getElementById('profileModal')
      const modal = bootstrap.Modal.getInstance(modalElement)
      if (modal) {
        modal.hide()
        this.alertsTarget.innerHTML = ''
      }
    }, 2000)
  }
}
