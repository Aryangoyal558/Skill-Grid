require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/user');
const Assessment = require('./models/Assessment');
const Attempt = require('./models/Attempt');
const Certificate = require('./models/Certificate');
const CertificateVerification = require('./models/CertificateVerification');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillgrid';

async function seedData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully.');

        // Clear existing seed data
        console.log('Clearing existing database collections...');
        await User.deleteMany({});
        await Assessment.deleteMany({});
        await Attempt.deleteMany({});
        await Certificate.deleteMany({});
        await CertificateVerification.deleteMany({});
        console.log('Database cleared.');

        // 1. Seed Users (Candidates & Examiner)
        console.log('Seeding Users...');
        const users = await User.insertMany([
            {
                name: 'Aryan Goyal',
                email: 'aryan.goyal@ujwalradiant.com',
                password: 'password123',
                role: 'candidate',
                phone_no: 9876543210
            },
            {
                name: 'Pragya Yadav',
                email: 'pragya.yadav@ujwalradiant.com',
                password: 'password123',
                role: 'candidate',
                phone_no: 9876543211
            },
            {
                name: 'Krishna Soni',
                email: 'krishna.soni@ujwalradiant.com',
                password: 'password123',
                role: 'candidate',
                phone_no: 9876543212
            },
            {
                name: 'Syed Saida',
                email: 'syed.saida@ujwalradiant.com',
                password: 'password123',
                role: 'candidate',
                phone_no: 9876543213
            },
            {
                name: 'Divyansh Verma',
                email: 'divyansh.verma@ujwalradiant.com',
                password: 'adminpassword123',
                role: 'examiner',
                phone_no: 9876543214
            }
        ]);
        console.log(`✓ Inserted ${users.length} Users.`);

        // Map users for reference
        const aryan = users[0];
        const pragya = users[1];
        const krishna = users[2];
        const syed = users[3];

        // 2. Seed Assessments
        console.log('Seeding Assessments...');
        const assessments = await Assessment.insertMany([
            {
                title: 'Full Stack Web Development (MERN)',
                description: 'Comprehensive evaluation of MongoDB, Express, React, and Node.js skills.',
                skillCategory: 'Web Development',
                durationMinutes: 60,
                totalMarks: 100,
                passingMark: 50,
                status: 'Published'
            },
            {
                title: 'Data Structures & Algorithms',
                description: 'Advanced assessment on problem solving, data structures, and algorithmic complexity.',
                skillCategory: 'Computer Science',
                durationMinutes: 90,
                totalMarks: 100,
                passingMark: 60,
                status: 'Published'
            },
            {
                title: 'Cloud Computing & DevOps Fundamentals',
                description: 'Evaluation of CI/CD pipelines, containerization, and cloud deployment.',
                skillCategory: 'Cloud & DevOps',
                durationMinutes: 45,
                totalMarks: 100,
                passingMark: 55,
                status: 'Published'
            }
        ]);
        console.log(`✓ Inserted ${assessments.length} Assessments.`);

        const mernCourse = assessments[0];
        const dsaCourse = assessments[1];
        const devopsCourse = assessments[2];

        // 3. Seed Attempts
        console.log('Seeding Assessment Attempts...');
        const attempts = await Attempt.insertMany([
            {
                studentId: aryan._id,
                assessmentId: mernCourse._id,
                startTime: new Date(Date.now() - 3600000 * 48),
                submissionTime: new Date(Date.now() - 3600000 * 47),
                status: 'completed',
                scoreObtained: 94,
                totalMarks: 100,
                isPassed: true
            },
            {
                studentId: pragya._id,
                assessmentId: mernCourse._id,
                startTime: new Date(Date.now() - 3600000 * 24),
                submissionTime: new Date(Date.now() - 3600000 * 23),
                status: 'completed',
                scoreObtained: 84,
                totalMarks: 100,
                isPassed: true
            },
            {
                studentId: krishna._id,
                assessmentId: dsaCourse._id,
                startTime: new Date(Date.now() - 3600000 * 12),
                submissionTime: new Date(Date.now() - 3600000 * 11),
                status: 'completed',
                scoreObtained: 76,
                totalMarks: 100,
                isPassed: true
            },
            {
                studentId: syed._id,
                assessmentId: devopsCourse._id,
                startTime: new Date(Date.now() - 3600000 * 6),
                submissionTime: new Date(Date.now() - 3600000 * 5),
                status: 'completed',
                scoreObtained: 42,
                totalMarks: 100,
                isPassed: false
            }
        ]);
        console.log(`✓ Inserted ${attempts.length} Assessment Attempts.`);

        // 4. Seed Pre-existing Certificates for Aryan & Pragya
        console.log('Seeding Initial Certificates...');
        const certificates = await Certificate.insertMany([
            {
                studentId: aryan._id,
                studentName: aryan.name,
                assessmentId: mernCourse._id,
                assessmentTitle: mernCourse.title,
                skillCategory: mernCourse.skillCategory,
                attemptId: attempts[0]._id,
                certificateNumber: 'SG-CERT-ARYAN94',
                issueDate: attempts[0].submissionTime,
                scoreObtained: 94,
                totalMarks: 100,
                grade: 'S (Outstanding)',
                status: 'active'
            },
            {
                studentId: pragya._id,
                studentName: pragya.name,
                assessmentId: mernCourse._id,
                assessmentTitle: mernCourse.title,
                skillCategory: mernCourse.skillCategory,
                attemptId: attempts[1]._id,
                certificateNumber: 'SG-CERT-PRAGYA84',
                issueDate: attempts[1].submissionTime,
                scoreObtained: 84,
                totalMarks: 100,
                grade: 'A (Excellent)',
                status: 'active'
            }
        ]);
        console.log(`✓ Inserted ${certificates.length} Initial Certificates.`);

        // 5. Seed Certificate Verification Logs
        console.log('Seeding Verification Logs...');
        const verifications = await CertificateVerification.insertMany([
            {
                certificateNumber: 'SG-CERT-ARYAN94',
                isValid: true,
                verifiedAt: new Date(Date.now() - 1800000),
                verifiedBy: 'Public Verifier (Employer)',
                metadata: {
                    ip: '192.168.1.100',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                }
            },
            {
                certificateNumber: 'INVALID-CODE-999',
                isValid: false,
                verifiedAt: new Date(Date.now() - 900000),
                verifiedBy: 'Public Verifier',
                metadata: {
                    ip: '192.168.1.105',
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
                }
            }
        ]);
        console.log(`✓ Inserted ${verifications.length} Verification Audit Logs.`);

        console.log('\n======================================================');
        console.log('   DATABASE SEEDING COMPLETED SUCCESSFULLY!           ');
        console.log('======================================================');
        console.log(`Users: ${users.length}`);
        console.log(`Assessments: ${assessments.length}`);
        console.log(`Attempts: ${attempts.length}`);
        console.log(`Certificates: ${certificates.length}`);
        console.log(`Verification Logs: ${verifications.length}`);
        console.log('Sample Certificate IDs for testing verification:');
        console.log(' - SG-CERT-ARYAN94 (Valid - Aryan Goyal)');
        console.log(' - SG-CERT-PRAGYA84 (Valid - Pragya Yadav)');
        console.log(` - Lazy generation attempt ID for Krishna Soni: ${attempts[2]._id}`);
        console.log('======================================================\n');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

// Run seed if executed directly
if (require.main === module) {
    seedData();
}

module.exports = seedData;
