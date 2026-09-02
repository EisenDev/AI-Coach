import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, reference_id } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.FISH_AUDIO_API_KEY;

    // If Fish Audio API key is provided, proxy request to Fish Audio
    if (apiKey && apiKey.trim() !== '') {
      try {
        const fishRes = await fetch('https://api.fish.audio/v1/tts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text.slice(0, 500), // optimal chunk length for low latency
            reference_id: reference_id || '7f92f8afb8ec43bf81429cc1c9199cb1', // natural executive voice
            format: 'mp3',
            latency: 'balanced',
          }),
        });

        if (fishRes.ok) {
          const audioBuffer = await fishRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.byteLength.toString(),
            },
          });
        } else {
          console.warn('[Fish Audio TTS] Fallback to browser synthesis:', await fishRes.text());
        }
      } catch (fishError) {
        console.warn('[Fish Audio TTS] Exception, using fallback:', fishError);
      }
    }

    // Return fallback indicator so client uses browser Web SpeechSynthesis
    return NextResponse.json({
      useBrowserTTS: true,
      text: text,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'TTS generation failed' }, { status: 500 });
  }
}
