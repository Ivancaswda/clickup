import {z} from 'zod'
import {Hono} from 'hono'
import {zValidator} from '@hono/zod-validator'
import {loginSchema, updateProfileSchema} from "@/features/auth/server/schema";
import {registerSchema} from "@/features/auth/server/schema";
import {createAdminClient} from "@/lib/appwrite";

import {ID} from 'node-appwrite'
import {setCookie, deleteCookie} from "hono/cookie";
import {AUTH_COOKIE} from "@/features/auth/constants";
import {sessionMiddleware} from "@/lib/session-middleware";

const app = new Hono()
    .get('/current', sessionMiddleware, (c) => {
        const user = c.get('user')

        return c.json({data:user})
    })
    .post('/login', zValidator('json', loginSchema), async (c) => {

        const {email, password} = c.req.valid('json')
        console.log({email,password})

        const {account} = await createAdminClient()
        const session = await account.createEmailPasswordSession(email, password)


        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30
        })

        return c.json({success:true})
    })
    .post('/register', zValidator('json', registerSchema), async (c) => {

        const {name, email, password} = c.req.valid('json')

        const {account} = await createAdminClient()
        await account.create(ID.unique(), email, password, name)

        const session = await account.createEmailPasswordSession(email, password)

        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30
        })


        return c.json({success:true})
    })
    .post('/logout', sessionMiddleware, async (c) => {
        const account = c.get('account');


        deleteCookie(c, AUTH_COOKIE)
        await account.deleteSession('current')


        return c.json({success: true})
    }).patch(
        "/update-profile",
        sessionMiddleware,
        zValidator("json", updateProfileSchema),
        async (c) => {
            const { name, desc } = c.req.valid("json")
            const user = c.get("user")
            const { users } = await createAdminClient()

            try {
                // Обновляем имя и desc (если задано)
                await users.updateName(user.$id, name)

                if (desc !== undefined) {
                    await users.updatePrefs(user.$id, {
                        ...user.prefs,
                        desc,
                    })
                }

                return c.json({ success: true })
            } catch (err) {
                console.error("[UpdateProfile Error]", err)
                return c.json({ error: "Failed to update profile" }, 500)
            }
        }
    )


export default app;