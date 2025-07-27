from pydub import AudioSegment, silence
import os

# Load the main MP3 file
audio = AudioSegment.from_mp3("brainrotnames.mp3")

# Split audio on silences longer than 370ms
chunks = silence.split_on_silence(audio, min_silence_len=500, silence_thresh=-40)

# List of names with trailing whitespace removed
names = [
    "ballerina cappuccina",
    "bambini crossini",
    "bluberini octopussini",
    "bobrito bandito",
    "bombardino crocodilo",
    "bombombini gusini",
    "brr brr patapim",
    "brri brri bicus dicus",
    "burbaloni loliloni",
    "cactusgelataio gattoalbanese",
    "cappuccino assassino",
    "chimpanzini bananini",
    "cocofanto elefanto",
    "crocodillo fromagioso",
    "ecco cavallo virtuoso",
    "frigo camello buffo fardello",
    "gattino babanino",
    "giraffa celeste",
    "graipussi medussi",
    "granade frulli frulli frullichino",
    "il cacto hipopotamo",
    "il sacro carbospaghetti mistico",
    "ketupat kepat brekupat kupat kepet kupot",
    "perochello lemonchello",
    "pippi poppa pippo peppe",
    "tigrulli grapefrutunni",
    "tralalero tralala",
    "trenostruzzo turbo 3000",
    "trick track barabum",
    "trilalero tralalima",
    "tripi tropi tropa tripa",
    "trulimero trulichina",
    "tung tung tung sahur",
    "uvanito pecorarito",
    "vulpegatto vulpegatto vulpegatto coco"
]

# Check if the number of chunks matches the number of names
if len(chunks) != len(names):
    print(f"Warning: {len(chunks)} chunks found, but {len(names)} names provided.")

# Export each chunk with the corresponding name
for i, chunk in enumerate(chunks):
    if i < len(names):
        filename = f"{names[i]}.mp3"
        chunk.export(filename, format="mp3")
        print(f"Exported: {filename}")
    else:
        print(f"Extra chunk {i+1} not named due to missing name.")
