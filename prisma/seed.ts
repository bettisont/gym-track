import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();


// runs after a migration, after we reset the database or can run it manually.
async function main() {
    const user = await prisma.user.upsert({
        where: {email: 'johnnyhamcheck@test.com'},
        update: {},
        create: {
            email: 'johnnyhamcheck@test.com',
            first_name: 'John',
            surname: 'Hamcheck',
            passwordHash: 'hash',
            workout_presets: {
                create: [{
                    name: 'Leg Day',
                    description: 'Focus on legs and lower body strength',
                    preset_exercises: {
                        create: [
                            {
                                order: 1,
                                exercise_relation: {
                                    create: {
                                        name: 'Squats',
                                        description: 'Standard barbell squats',
                                        muscle_group: 'Legs',
                                    },
                                },
                            },
                            {
                                order: 2,
                                exercise_relation: {
                                    create: {
                                        name: 'Deadlifts',
                                        description: 'Standard barbell deadlifts',
                                        muscle_group: 'Back and legs',
                                    },
                                },
                            },
                        ],
                    },
                }],
            },
        },
        include: {
            workout_presets: {
                include: {
                    preset_exercises: true,
                },
            },
        },
    });

    console.log({ user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
