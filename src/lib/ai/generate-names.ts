

export async function generateNamesFromAI({
                                              type,
                                              count,
                                              apiKey,
                                          }: {
    type: 'workspace' | 'project' | 'task',
    count: number,
    apiKey: string
}): Promise<string[]> {

    const promptMap = {
        workspace: "Придумай короткие и уникальные имена для рабочих пространств в стиле SaaS. Например, Acme, Syncflow, NovaBoard. Верни список из {n} имён.",
        project: "Придумай уникальные и короткие названия для проектов по разработке ПО. Например: Apollo, Mercury, QuantumCore. Верни список из {n} имён.",
        task: "Придумай краткие названия для задач в проекте. Например: Настроить деплой, Написать документацию, Добавить авторизацию. Верни список из {n} названий.",
    }

    const prompt = promptMap[type].replace('{n}', String(count));

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b:free",
            messages: [
                { role: "system", content: "Ты помогаешь генерировать креативные названия для пользователя." },
                { role: "user", content: prompt }
            ],
            temperature: 0.9
        }),
    });

    const json = await res.json();

    const output = json?.choices?.[0]?.message?.content || "";


    const names = output
        .split('\n')
        .map(name => name.replace(/^[\d\.\-\s]+/, '').trim())
        .filter(Boolean)
        .slice(0, count);

    return names;
}
