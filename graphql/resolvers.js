const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        hello: () => 'Hello World',
        currentUser: (parent, args, { user, cuarto }) => {
            // this if statement is our authentication check
            if (!user) {
                throw new Error('Not Authenticated');
            }
            return cuarto({
                username: 'Richar',
                password: '1234'
            });
        }
    },
    Mutation: {
        // register: async (parent, { username, password }, ctx, info) => {
        //     const hashedPassword = await bcrypt.hash(password, 10);
        //     const user = await ctx.cuarto({
        //         username,
        //         password: hashedPassword
        //     });
        //     return user;
        // },

        login: async (parent, { username, password }, ctx, info) => {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await ctx.f_user(username);

            if (!user) {
                throw new Error('Invalid Login');
            }

            const passwordMatch = await bcrypt.compare(password, user.pass);

            if (!passwordMatch) {
                throw new Error('Invalid Login');
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.correo
                },
                'solo_yo',
                {
                    expiresIn: '30d' // token will expire in 30days
                }
            );
            console.log(user);
            return {
                token,
                user
            };
        }
    }
};

module.exports = resolvers;
