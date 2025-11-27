// Email service for sending notifications
// Using a simple console log approach - replace with actual email service like nodemailer, sendgrid, etc.

const sendApplicationEmail = async (recipientEmail, applicantName, jobTitle) => {
    try {
        // In production, replace this with actual email sending logic
        // Example with nodemailer:
        // const transporter = nodemailer.createTransport({...})
        // await transporter.sendMail({...})
        
        console.log(`
        ======== APPLICATION CONFIRMATION EMAIL ========
        To: ${recipientEmail}
        Subject: Application Submitted Successfully - ${jobTitle}
        
        Dear ${applicantName},
        
        Your application for the position "${jobTitle}" has been submitted successfully.
        
        We will review your application and get back to you soon.
        
        Best regards,
        JobNest Team
        ================================================
        `)
        
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}

const sendWelcomeEmail = async (recipientEmail, userName, userType) => {
    try {
        console.log(`
        ======== WELCOME EMAIL ========
        To: ${recipientEmail}
        Subject: Welcome to JobNest!
        
        Dear ${userName},
        
        Welcome to JobNest! Your ${userType} account has been created successfully.
        
        ${userType === 'Jobseeker' 
            ? 'Please complete your profile and take the personality assessment to start seeing matched jobs.'
            : 'Please complete your company profile to start posting jobs.'}
        
        Best regards,
        JobNest Team
        ===============================
        `)
        
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}

const sendStatusUpdateEmail = async (recipientEmail, applicantName, jobTitle, newStatus) => {
    try {
        console.log(`
        ======== APPLICATION STATUS UPDATE ========
        To: ${recipientEmail}
        Subject: Application Status Update - ${jobTitle}
        
        Dear ${applicantName},
        
        Your application status for "${jobTitle}" has been updated to: ${newStatus}
        
        ${newStatus === 'To Be Interviewed' 
            ? 'Congratulations! The employer would like to schedule an interview with you.'
            : newStatus === 'Hired'
            ? 'Congratulations! You have been hired for this position.'
            : 'Thank you for your interest in this position.'}
        
        Best regards,
        JobNest Team
        ===========================================
        `)
        
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}

module.exports = {
    sendApplicationEmail,
    sendWelcomeEmail,
    sendStatusUpdateEmail
}
