import numpy as np
from scipy.io.wavfile import write

duration = 5  # seconds
frequency = 2500  # Hz
sample_rate = 44100  # Hz

t = np.linspace(0, duration, int(sample_rate * duration), False)
tone = 0.5 * np.sin(2 * np.pi * frequency * t)

# Convert to 16-bit PCM
audio = np.int16(tone * 32767)

write("beep.wav", sample_rate, audio)

from pydub import AudioSegment

# Load the .wav file
sound = AudioSegment.from_wav("beep.wav")

# Export as .mp3
sound.export("beep.mp3", format="mp3")

