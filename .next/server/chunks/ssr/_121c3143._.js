module.exports = {

"[project]/tests/prompts/basic.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "TEST_PROMPTS": (()=>TEST_PROMPTS)
});
const TEST_PROMPTS = {
    USER_SKY: {
        role: 'user',
        content: [
            {
                type: 'text',
                text: 'Why is the sky blue?'
            }
        ]
    },
    USER_GRASS: {
        role: 'user',
        content: [
            {
                type: 'text',
                text: 'Why is grass green?'
            }
        ]
    },
    USER_THANKS: {
        role: 'user',
        content: [
            {
                type: 'text',
                text: 'Thanks!'
            }
        ]
    },
    USER_NEXTJS: {
        role: 'user',
        content: [
            {
                type: 'text',
                text: 'What are the advantages of using Next.js?'
            }
        ]
    },
    USER_IMAGE_ATTACHMENT: {
        role: 'user',
        content: [
            {
                type: 'file',
                mediaType: '...',
                data: '...'
            },
            {
                type: 'text',
                text: 'Who painted this?'
            }
        ]
    },
    USER_TEXT_ARTIFACT: {
        role: 'user',
        content: [
            {
                type: 'text',
                text: 'Help me write an essay about Silicon Valley'
            }
        ]
    },
    CREATE_DOCUMENT_TEXT_CALL: {
        role: 'user',
        content: [
            {
                type: 'text',
                text: 'Essay about Silicon Valley'
            }
        ]
    },
    CREATE_DOCUMENT_TEXT_RESULT: {
        role: 'tool',
        content: [
            {
                type: 'tool-result',
                toolCallId: 'call_123',
                toolName: 'createDocument',
                output: {
                    type: 'json',
                    value: {
                        id: '3ca386a4-40c6-4630-8ed1-84cbd46cc7eb',
                        title: 'Essay about Silicon Valley',
                        kind: 'text',
                        content: 'A document was created and is now visible to the user.'
                    }
                }
            }
        ]
    },
    GET_WEATHER_CALL: {
        role: 'user',
        content: [
            {
                type: 'text',
                text: "What's the weather in sf?"
            }
        ]
    },
    GET_WEATHER_RESULT: {
        role: 'tool',
        content: [
            {
                type: 'tool-result',
                toolCallId: 'call_456',
                toolName: 'getWeather',
                output: {
                    type: 'json',
                    value: {
                        latitude: 37.763283,
                        longitude: -122.41286,
                        generationtime_ms: 0.06449222564697266,
                        utc_offset_seconds: -25200,
                        timezone: 'America/Los_Angeles',
                        timezone_abbreviation: 'GMT-7',
                        elevation: 18,
                        current_units: {
                            time: 'iso8601',
                            interval: 'seconds',
                            temperature_2m: '°C'
                        },
                        current: {
                            time: '2025-03-10T14:00',
                            interval: 900,
                            temperature_2m: 17
                        },
                        daily_units: {
                            time: 'iso8601',
                            sunrise: 'iso8601',
                            sunset: 'iso8601'
                        },
                        daily: {
                            time: [
                                '2025-03-10',
                                '2025-03-11',
                                '2025-03-12',
                                '2025-03-13',
                                '2025-03-14',
                                '2025-03-15',
                                '2025-03-16'
                            ],
                            sunrise: [
                                '2025-03-10T07:27',
                                '2025-03-11T07:25',
                                '2025-03-12T07:24',
                                '2025-03-13T07:22',
                                '2025-03-14T07:21',
                                '2025-03-15T07:19',
                                '2025-03-16T07:18'
                            ],
                            sunset: [
                                '2025-03-10T19:12',
                                '2025-03-11T19:13',
                                '2025-03-12T19:14',
                                '2025-03-13T19:15',
                                '2025-03-14T19:16',
                                '2025-03-15T19:17',
                                '2025-03-16T19:17'
                            ]
                        }
                    }
                }
            }
        ]
    }
};
}}),
"[project]/tests/prompts/utils.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "compareMessages": (()=>compareMessages),
    "getResponseChunksByPrompt": (()=>getResponseChunksByPrompt)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/provider-utils/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tests/prompts/basic.ts [app-rsc] (ecmascript)");
;
;
function compareMessages(firstMessage, secondMessage) {
    if (firstMessage.role !== secondMessage.role) return false;
    if (!Array.isArray(firstMessage.content) || !Array.isArray(secondMessage.content)) {
        return false;
    }
    if (firstMessage.content.length !== secondMessage.content.length) {
        return false;
    }
    for(let i = 0; i < firstMessage.content.length; i++){
        const item1 = firstMessage.content[i];
        const item2 = secondMessage.content[i];
        if (item1.type !== item2.type) return false;
        if (item1.type === 'file' && item2.type === 'file') {
        // if (item1.image.toString() !== item2.image.toString()) return false;
        // if (item1.mimeType !== item2.mimeType) return false;
        } else if (item1.type === 'text' && item2.type === 'text') {
            if (item1.text !== item2.text) return false;
        } else if (item1.type === 'tool-result' && item2.type === 'tool-result') {
            if (item1.toolCallId !== item2.toolCallId) return false;
        } else {
            return false;
        }
    }
    return true;
}
const textToDeltas = (text)=>{
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateId"])();
    const deltas = text.split(' ').map((char)=>({
            id,
            type: 'text-delta',
            delta: `${char} `
        }));
    return [
        {
            id,
            type: 'text-start'
        },
        ...deltas,
        {
            id,
            type: 'text-end'
        }
    ];
};
const reasoningToDeltas = (text)=>{
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateId"])();
    const deltas = text.split(' ').map((char)=>({
            id,
            type: 'reasoning-delta',
            delta: `${char} `
        }));
    return [
        {
            id,
            type: 'reasoning-start'
        },
        ...deltas,
        {
            id,
            type: 'reasoning-end'
        }
    ];
};
const getResponseChunksByPrompt = (prompt, isReasoningEnabled = false)=>{
    const recentMessage = prompt.at(-1);
    if (!recentMessage) {
        throw new Error('No recent message found!');
    }
    if (isReasoningEnabled) {
        if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_SKY)) {
            return [
                ...reasoningToDeltas('The sky is blue because of rayleigh scattering!'),
                ...textToDeltas("It's just blue duh!"),
                {
                    type: 'finish',
                    finishReason: 'stop',
                    usage: {
                        inputTokens: 3,
                        outputTokens: 10,
                        totalTokens: 13
                    }
                }
            ];
        } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_GRASS)) {
            return [
                ...reasoningToDeltas('Grass is green because of chlorophyll absorption!'),
                ...textToDeltas("It's just green duh!"),
                {
                    type: 'finish',
                    finishReason: 'stop',
                    usage: {
                        inputTokens: 3,
                        outputTokens: 10,
                        totalTokens: 13
                    }
                }
            ];
        }
    }
    if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_THANKS)) {
        return [
            ...textToDeltas("You're welcome!"),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_GRASS)) {
        return [
            ...textToDeltas("It's just green duh!"),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_SKY)) {
        return [
            ...textToDeltas("It's just blue duh!"),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_NEXTJS)) {
        return [
            ...textToDeltas('With Next.js, you can ship fast!'),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_IMAGE_ATTACHMENT)) {
        return [
            ...textToDeltas('This painting is by Monet!'),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].USER_TEXT_ARTIFACT)) {
        const toolCallId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateId"])();
        return [
            {
                id: toolCallId,
                type: 'tool-input-start',
                toolName: 'createDocument'
            },
            {
                id: toolCallId,
                type: 'tool-input-delta',
                delta: JSON.stringify({
                    title: 'Essay about Silicon Valley',
                    kind: 'text'
                })
            },
            {
                id: toolCallId,
                type: 'tool-input-end'
            },
            {
                toolCallId: toolCallId,
                type: 'tool-result',
                toolName: 'createDocument',
                result: {
                    id: 'doc_123',
                    title: 'Essay about Silicon Valley',
                    kind: 'text'
                }
            },
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].CREATE_DOCUMENT_TEXT_CALL)) {
        return [
            ...textToDeltas(`\n
# Silicon Valley: The Epicenter of Innovation

## Origins and Evolution

Silicon Valley, nestled in the southern part of the San Francisco Bay Area, emerged as a global technology hub in the late 20th century. Its transformation began in the 1950s when Stanford University encouraged its graduates to start their own companies nearby, leading to the formation of pioneering semiconductor firms that gave the region its name.

## The Innovation Ecosystem

What makes Silicon Valley unique is its perfect storm of critical elements: prestigious universities like Stanford and Berkeley, abundant venture capital, a culture that celebrates risk-taking, and a dense network of talented individuals. This ecosystem has consistently nurtured groundbreaking technologies from personal computers to social media platforms to artificial intelligence.

## Challenges and Criticisms

Despite its remarkable success, Silicon Valley faces significant challenges including extreme income inequality, housing affordability crises, and questions about technology's impact on society. Critics argue the region has developed a monoculture that sometimes struggles with diversity and inclusion.

## Future Prospects

As we move forward, Silicon Valley continues to reinvent itself. While some predict its decline due to remote work trends and competition from other tech hubs, the region's adaptability and innovative spirit suggest it will remain influential in shaping our technological future for decades to come.
`),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].CREATE_DOCUMENT_TEXT_RESULT)) {
        return [
            ...textToDeltas('A document was created and is now visible to the user.'),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].GET_WEATHER_CALL)) {
        return [
            {
                type: 'tool-call',
                toolCallId: 'call_456',
                toolName: 'getWeather',
                input: JSON.stringify({
                    latitude: 37.7749,
                    longitude: -122.4194
                })
            },
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    } else if (compareMessages(recentMessage, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$basic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TEST_PROMPTS"].GET_WEATHER_RESULT)) {
        return [
            ...textToDeltas('The current temperature in San Francisco is 17°C.'),
            {
                type: 'finish',
                finishReason: 'stop',
                usage: {
                    inputTokens: 3,
                    outputTokens: 10,
                    totalTokens: 13
                }
            }
        ];
    }
    return [
        {
            id: '6',
            type: 'text-delta',
            delta: 'Unknown test prompt!'
        }
    ];
};
}}),
"[project]/lib/ai/models.test.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "artifactModel": (()=>artifactModel),
    "chatModel": (()=>chatModel),
    "reasoningModel": (()=>reasoningModel),
    "titleModel": (()=>titleModel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$test$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/test/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tests/prompts/utils.ts [app-rsc] (ecmascript)");
;
;
;
const chatModel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$test$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MockLanguageModelV2"]({
    doGenerate: async ()=>({
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            },
            finishReason: 'stop',
            usage: {
                inputTokens: 10,
                outputTokens: 20,
                totalTokens: 30
            },
            content: [
                {
                    type: 'text',
                    text: 'Hello, world!'
                }
            ],
            warnings: []
        }),
    doStream: async ({ prompt })=>({
            stream: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["simulateReadableStream"])({
                chunkDelayInMs: 500,
                initialDelayInMs: 1000,
                chunks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResponseChunksByPrompt"])(prompt)
            }),
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            }
        })
});
const reasoningModel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$test$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MockLanguageModelV2"]({
    doGenerate: async ()=>({
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            },
            finishReason: 'stop',
            usage: {
                inputTokens: 10,
                outputTokens: 20,
                totalTokens: 30
            },
            content: [
                {
                    type: 'text',
                    text: 'Hello, world!'
                }
            ],
            warnings: []
        }),
    doStream: async ({ prompt })=>({
            stream: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["simulateReadableStream"])({
                chunkDelayInMs: 500,
                initialDelayInMs: 1000,
                chunks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResponseChunksByPrompt"])(prompt, true)
            }),
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            }
        })
});
const titleModel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$test$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MockLanguageModelV2"]({
    doGenerate: async ()=>({
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            },
            finishReason: 'stop',
            usage: {
                inputTokens: 10,
                outputTokens: 20,
                totalTokens: 30
            },
            content: [
                {
                    type: 'text',
                    text: 'This is a test title'
                }
            ],
            warnings: []
        }),
    doStream: async ()=>({
            stream: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["simulateReadableStream"])({
                chunkDelayInMs: 500,
                initialDelayInMs: 1000,
                chunks: [
                    {
                        id: '1',
                        type: 'text-start'
                    },
                    {
                        id: '1',
                        type: 'text-delta',
                        delta: 'This is a test title'
                    },
                    {
                        id: '1',
                        type: 'text-end'
                    },
                    {
                        type: 'finish',
                        finishReason: 'stop',
                        usage: {
                            inputTokens: 3,
                            outputTokens: 10,
                            totalTokens: 13
                        }
                    }
                ]
            }),
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            }
        })
});
const artifactModel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$test$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MockLanguageModelV2"]({
    doGenerate: async ()=>({
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            },
            finishReason: 'stop',
            usage: {
                inputTokens: 10,
                outputTokens: 20,
                totalTokens: 30
            },
            content: [
                {
                    type: 'text',
                    text: 'Hello, world!'
                }
            ],
            warnings: []
        }),
    doStream: async ({ prompt })=>({
            stream: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["simulateReadableStream"])({
                chunkDelayInMs: 50,
                initialDelayInMs: 100,
                chunks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$tests$2f$prompts$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResponseChunksByPrompt"])(prompt)
            }),
            rawCall: {
                rawPrompt: null,
                rawSettings: {}
            }
        })
});
}}),
"[project]/lib/ai/providers.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "myProvider": (()=>myProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$xai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/xai/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$test$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/models.test.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-rsc] (ecmascript)");
;
;
;
;
const myProvider = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isTestEnvironment"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["customProvider"])({
    languageModels: {
        'chat-model': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$test$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["chatModel"],
        'chat-model-reasoning': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$test$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["reasoningModel"],
        'title-model': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$test$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["titleModel"],
        'artifact-model': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$models$2e$test$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["artifactModel"]
    }
}) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["customProvider"])({
    languageModels: {
        'chat-model': (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$xai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["xai"])('grok-2-vision-1212'),
        'chat-model-reasoning': (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["wrapLanguageModel"])({
            model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$xai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["xai"])('grok-3-mini-beta'),
            middleware: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["extractReasoningMiddleware"])({
                tagName: 'think'
            })
        }),
        'title-model': (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$xai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["xai"])('grok-2-1212'),
        'artifact-model': (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$xai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["xai"])('grok-2-1212')
    },
    imageModels: {
        'small-model': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$xai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["xai"].imageModel('grok-2-image')
    }
});
}}),
"[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"403098fbac3bb4c02586ae90120eedd58ffdf6808a":"deleteTrailingMessages","406445b45a874834bd5d87c0979376ae0be267f281":"updateChatVisibility","40a1a20c42a07b659b86f430330abd765fe25bb6d0":"saveChatModelAsCookie","40d00df991cb40c517a09b281dd5f993ba333cf7d5":"generateTitleFromUserMessage"},"",""] */ __turbopack_context__.s({
    "deleteTrailingMessages": (()=>deleteTrailingMessages),
    "generateTitleFromUserMessage": (()=>generateTitleFromUserMessage),
    "saveChatModelAsCookie": (()=>saveChatModelAsCookie),
    "updateChatVisibility": (()=>updateChatVisibility)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$providers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai/providers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db/queries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function saveChatModelAsCookie(model) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set('chat-model', model);
}
async function generateTitleFromUserMessage({ message }) {
    const { text: title } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
        model: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2f$providers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["myProvider"].languageModel('title-model'),
        system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
        prompt: JSON.stringify(message)
    });
    return title;
}
async function deleteTrailingMessages({ id }) {
    const messages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMessageById"])({
        id
    });
    const message = messages[0];
    if (!message) {
        console.log('Stub: No message found for id:', id);
        return;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteMessagesByChatIdAfterTimestamp"])({
        chatId: message.chatId,
        timestamp: message.createdAt
    });
}
async function updateChatVisibility({ chatId, visibility }) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateChatVisiblityById"])({
        chatId,
        visibility
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    saveChatModelAsCookie,
    generateTitleFromUserMessage,
    deleteTrailingMessages,
    updateChatVisibility
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveChatModelAsCookie, "40a1a20c42a07b659b86f430330abd765fe25bb6d0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generateTitleFromUserMessage, "40d00df991cb40c517a09b281dd5f993ba333cf7d5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTrailingMessages, "403098fbac3bb4c02586ae90120eedd58ffdf6808a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateChatVisibility, "406445b45a874834bd5d87c0979376ae0be267f281", null);
}}),
"[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)");
;
}}),
"[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$chat$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "406445b45a874834bd5d87c0979376ae0be267f281": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateChatVisibility"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$chat$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "406445b45a874834bd5d87c0979376ae0be267f281": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$chat$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["406445b45a874834bd5d87c0979376ae0be267f281"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$chat$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$chat$292f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f28$chat$292f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(chat)/page/actions.js { ACTIONS_MODULE0 => "[project]/app/(chat)/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/app/(chat)/twitter-image.png.mjs { IMAGE => \"[project]/app/(chat)/twitter-image.png (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/(chat)/twitter-image.png.mjs { IMAGE => \"[project]/app/(chat)/twitter-image.png (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/app/(chat)/opengraph-image.png.mjs { IMAGE => \"[project]/app/(chat)/opengraph-image.png (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/(chat)/opengraph-image.png.mjs { IMAGE => \"[project]/app/(chat)/opengraph-image.png (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/app/(chat)/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/(chat)/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/components/minimal-components/minimalChat.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Chat": (()=>Chat)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const Chat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Chat() from the server but Chat is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/minimal-components/minimalChat.tsx <module evaluation>", "Chat");
}}),
"[project]/components/minimal-components/minimalChat.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Chat": (()=>Chat)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const Chat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Chat() from the server but Chat is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/minimal-components/minimalChat.tsx", "Chat");
}}),
"[project]/components/minimal-components/minimalChat.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$minimal$2d$components$2f$minimalChat$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/minimal-components/minimalChat.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$minimal$2d$components$2f$minimalChat$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/components/minimal-components/minimalChat.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$minimal$2d$components$2f$minimalChat$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/lib/errors.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ChatSDKError": (()=>ChatSDKError),
    "getMessageByErrorCode": (()=>getMessageByErrorCode),
    "visibilityBySurface": (()=>visibilityBySurface)
});
const visibilityBySurface = {
    database: 'log',
    chat: 'response',
    auth: 'response',
    stream: 'response',
    api: 'response',
    history: 'response',
    vote: 'response',
    document: 'response',
    suggestions: 'response'
};
class ChatSDKError extends Error {
    type;
    surface;
    statusCode;
    constructor(errorCode, cause){
        super();
        const [type, surface] = errorCode.split(':');
        this.type = type;
        this.cause = cause;
        this.surface = surface;
        this.message = getMessageByErrorCode(errorCode);
        this.statusCode = getStatusCodeByType(this.type);
    }
    toResponse() {
        const code = `${this.type}:${this.surface}`;
        const visibility = visibilityBySurface[this.surface];
        const { message, cause, statusCode } = this;
        if (visibility === 'log') {
            console.error({
                code,
                message,
                cause
            });
            return Response.json({
                code: '',
                message: 'Something went wrong. Please try again later.'
            }, {
                status: statusCode
            });
        }
        return Response.json({
            code,
            message,
            cause
        }, {
            status: statusCode
        });
    }
}
function getMessageByErrorCode(errorCode) {
    if (errorCode.includes('database')) {
        return 'An error occurred while executing a database query.';
    }
    switch(errorCode){
        case 'bad_request:api':
            return "The request couldn't be processed. Please check your input and try again.";
        case 'unauthorized:auth':
            return 'You need to sign in before continuing.';
        case 'forbidden:auth':
            return 'Your account does not have access to this feature.';
        case 'rate_limit:chat':
            return 'You have exceeded your maximum number of messages for the day. Please try again later.';
        case 'not_found:chat':
            return 'The requested chat was not found. Please check the chat ID and try again.';
        case 'forbidden:chat':
            return 'This chat belongs to another user. Please check the chat ID and try again.';
        case 'unauthorized:chat':
            return 'You need to sign in to view this chat. Please sign in and try again.';
        case 'offline:chat':
            return "We're having trouble sending your message. Please check your internet connection and try again.";
        case 'not_found:document':
            return 'The requested document was not found. Please check the document ID and try again.';
        case 'forbidden:document':
            return 'This document belongs to another user. Please check the document ID and try again.';
        case 'unauthorized:document':
            return 'You need to sign in to view this document. Please sign in and try again.';
        case 'bad_request:document':
            return 'The request to create or update the document was invalid. Please check your input and try again.';
        default:
            return 'Something went wrong. Please try again later.';
    }
}
function getStatusCodeByType(type) {
    switch(type){
        case 'bad_request':
            return 400;
        case 'unauthorized':
            return 401;
        case 'forbidden':
            return 403;
        case 'not_found':
            return 404;
        case 'rate_limit':
            return 429;
        case 'offline':
            return 503;
        default:
            return 500;
    }
}
}}),
"[project]/lib/utils.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn),
    "convertToUIMessages": (()=>convertToUIMessages),
    "fetchWithErrorHandlers": (()=>fetchWithErrorHandlers),
    "fetcher": (()=>fetcher),
    "generateUUID": (()=>generateUUID),
    "getDocumentTimestampByIndex": (()=>getDocumentTimestampByIndex),
    "getLocalStorage": (()=>getLocalStorage),
    "getMostRecentUserMessage": (()=>getMostRecentUserMessage),
    "getTextFromMessage": (()=>getTextFromMessage),
    "getTrailingMessageId": (()=>getTrailingMessageId),
    "sanitizeText": (()=>sanitizeText)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/errors.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatISO.js [app-rsc] (ecmascript)");
;
;
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
const fetcher = async (url)=>{
    const response = await fetch(url);
    if (!response.ok) {
        const { code, cause } = await response.json();
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatSDKError"](code, cause);
    }
    return response.json();
};
async function fetchWithErrorHandlers(input, init) {
    try {
        const response = await fetch(input, init);
        if (!response.ok) {
            const { code, cause } = await response.json();
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatSDKError"](code, cause);
        }
        return response;
    } catch (error) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ChatSDKError"]('offline:chat');
        }
        throw error;
    }
}
function getLocalStorage(key) {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    return [];
}
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
function getMostRecentUserMessage(messages) {
    const userMessages = messages.filter((message)=>message.role === 'user');
    return userMessages.at(-1);
}
function getDocumentTimestampByIndex(documents, index) {
    if (!documents) return new Date();
    if (index > documents.length) return new Date();
    return documents[index].createdAt;
}
function getTrailingMessageId({ messages }) {
    const trailingMessage = messages.at(-1);
    if (!trailingMessage) return null;
    return trailingMessage.id;
}
function sanitizeText(text) {
    return text.replace('<has_function_call>', '');
}
function convertToUIMessages(messages) {
    return messages.map((message)=>({
            id: message.id,
            role: message.role,
            parts: message.parts,
            metadata: {
                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatISO"])(message.createdAt)
            }
        }));
}
function getTextFromMessage(message) {
    return message.parts.filter((part)=>part.type === 'text').map((part)=>part.text).join('');
}
}}),
"[project]/app/(chat)/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// import { Chat } from '@/components/chat';
__turbopack_context__.s({
    "default": (()=>Page)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$minimal$2d$components$2f$minimalChat$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/minimal-components/minimalChat.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
async function Page() {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUUID"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$minimal$2d$components$2f$minimalChat$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Chat"], {}, void 0, false, {
                fileName: "[project]/app/(chat)/page.tsx",
                lineNumber: 19,
                columnNumber: 5
            }, this),
            ";"
        ]
    }, void 0, true);
}
}}),
"[project]/app/(chat)/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/(chat)/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=_121c3143._.js.map