temp_1 = {
    "Beige": ["Beige", "Cream", "Vanilla Sand", "Whipped Ivory", "Burnt Ivory"],
    "Black": ["Black", "Obsidian Black", "Obsidian Noir", "Velvét Noir", "Snow Obsidian", "Charcoal Mist", "Noiré Bellé", "Obsidian Fade", "Charcoal", "Black & White"],
    "Blue": ["Blue", "Light Blue", "Royal Blue", "Royal Deep Blue", "Bluebell Bronze", "Blue River", "Cloudy Sky", "Iceline Indigo", "Sea Blue", "Light Powder Blue"],
    "Brown": ["Brown", "Leopard", "Cocoa Luxe", "Chocolate Brown", "Golden Mocha", "Coffee Mocha", "Cocoa Drape", "Hazlenut", "Latte"],
    "Gold": ["Gold", "Golden Drift"],
    "Green": ["Green", "Forrest Greens", "Olive Green", "Thorneleaf"],
    "Grey": ["Grey", "Slate Grey", "Charcoal", "Eucalyptus Mist"],
    "Orange": ["Orange", "Sunrise", "Rosy Ember", "Molten Ember"],
    "Pink": ["Pink", "Sugar Rose", "Blushing Snow", "Berry Luxe", "Cherry Blossom Mint", "Sugar Pearl"],
    "Purple": ["Purple", "Lavender", "Lavender Sky", "Violet Cream"],
    "Red": ["Red", "Maroon", "Crimson Pearl", "Burgundy"],
    "Turquoise": ["Turquoise"],
    "White": ["White", "Snow Obsidian", "Lemon Lace", "Sugar Rose", "Lavender Sky", "Blushing Snow", "White Ember", "Black & White"],
    "Yellow": ["Yellow", "Leopard", "Bluebell Bronze", "Golden Mocha", "Lemon Lace", "Sunshine", "Crazy Yellow"],
    "Multi-Colored": ["Cherry Blossom Mint", "Sugar Pearl", "Iceline Indigo", "Bronze Obsidian", "Molten Ember", "Sugar Bloom", "Bluebell Bronze"]
}

temp_2 = {
    "Beige": ["Beige", "Cream", "Vanilla Sand"],
    "Black": ["Black", "Obsidian Black", "Obsidian Noir", "Velvét Noir", "Snow Obsidian", "Charcoal Mist", "Noiré Bellé", "Noir Eclairs", "Obsidian Tide", "Monochrome Grid"],
    "Blue": ["Blue", "Royal Blue", "Royal Deep Blue", "Bluebell Bronze", "Blue River", "Cloudy Sky", "Iceline Indigo", "Celestial Mist", "Ocean", "Arctic Oasis", "Obsidian Tide", "Regal Horizon", "Indigo Stripes"],
    "Brown": ["Brown", "Leopard", "Cocoa Luxe", "Chocolate Brown", "Golden Mocha", "Coffee Mocha", "Cocoa Drape", "Hazlenut", "Velvét Espresso", "Taupe", "Light Brown"],
    "Green": ["Green", "Forrest Greens", "Olive Green", "Dark Green", "Celestial Mist", "Ocean", "Golden Tide", "Obsidian Tide", "Shadow Pine", "Sage Tide"],
    "Grey": ["Grey", "Slate Grey", "Crimson Ash"],
    "Orange": ["Orange", "Sunrise", "Rosy Ember", "Solar Veil", "Amber Solstice", "Citrus Créme"],
    "Pink": ["Pink", "Sugar Rose", "Blushing Snow", "Berry Luxe", "Cherry Blossom Mint", "Sugar Pearl", "Mauve"],
    "Purple": ["Purple", "Lavender", "Lavender Sky", "Violet Cream"],
    "Red": ["Red", "Maroon", "Crimson Pearl", "Oxblood Luxe", "Burgundy", "Crimson Dusk", "Crimson Thread"],
    "White": ["White", "Snow Obsidian", "Lemon Lace", "Sugar Rose", "Lavender Sky", "Blushing Snow", "White Ember", "Arctic Oasis", "Regal Horizon", "Sage Tide", "Monochrome Grid"],
    "Yellow": ["Yellow", "Leopard", "Bluebell Bronze", "Golden Mocha", "Lemon Lace", "Crimson Dusk", "Golden Tide", "Amber Solstice", "Noir Eclairs", "Regal Horizon"],
    "Multi-Colored": ["Multi-Colored", "Cherry Blossom Mint", "Sugar Pearl", "Iceline Indigo", "Crimson Ash"]
}

for key in temp_1:
    if (key in temp_2):
        temp_val = temp_2[key]
        for val in temp_val:
            if val not in temp_1[key]:
                temp_1[key].append(val)
print(temp_1)