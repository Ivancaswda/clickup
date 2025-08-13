'use server'

import {createAdminClient} from "@/lib/appwrite";

import {headers} from "next/headers";

import {OAuthProvider} from "node-appwrite";
import {redirect} from "next/navigation";

export async function signUpWithGithub() {
    const {account} = await createAdminClient()

    const origin = await headers().get('origin')

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Github,
        `${origin}/oauth`,
        `${origin}/sign-up`
    )
    return redirect(redirectUrl)
}
export async function signUpWithGoogle() {
    const {account} = await createAdminClient()

    const origin = await headers().get('origin')

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Google,
        `${origin}/oauth`,
        `${origin}/sign-up`
    )
    return redirect(redirectUrl)
}

export async function signUpWithYandex() {
    const {account} = await createAdminClient();
    const origin = await headers().get('origin');

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Yandex,
        `${origin}/oauth`,
        `${origin}/sign-up`
    );

    return redirect(redirectUrl);
}

export async function signUpWithDiscord() {
    const {account} = await createAdminClient();
    const origin = await headers().get('origin');

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Discord,
        `${origin}/oauth`,
        `${origin}/sign-up`
    );

    return redirect(redirectUrl);
}