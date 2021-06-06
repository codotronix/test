export const FLOW_ST_WIDTH = 150
export const FLOW_ST_HEIGHT = 50
export const FLOW_KNOW_RAD = 6
export const FLOW_KNOT_IN_X = FLOW_ST_WIDTH / 2
export const FLOW_KNOT_IN_Y = -(FLOW_KNOW_RAD/2)
export const FLOW_KNOT_OUT_X = FLOW_ST_WIDTH / 2
export const FLOW_KNOT_OUT_Y = FLOW_ST_HEIGHT + (FLOW_KNOW_RAD/2)
export const FLOW_WIRE_SHIFT_X = FLOW_ST_WIDTH / 2
export const FLOW_WIRE_SHIFT_FROM_Y = FLOW_ST_HEIGHT + (FLOW_KNOW_RAD/2)
export const FLOW_WIRE_SHIFT_TO_Y = -(FLOW_KNOW_RAD/2)
export const FLOW_H_GAP = 50    // Gap between 2 ST
export const FLOW_V_GAP = 80    // Gap between 2 ST
export const FLOW_H_SHIFT = 20  // to move the entire setup by a constant amount without breaking anything
export const FLOW_V_SHIFT = 30  // to move the entire setup by a constant amount without breaking anything
export const FLOW_SPEED = 10
export const LOCAL_TALE_IDENTIFIER = "__local__"


export const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic (CAR)","Chad","Chile","China","Colombia","Comoros","Congo, Democratic Republic of the","Congo, Republic of the","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini (formerly Swaziland)","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar (formerly Burma)","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia (formerly Macedonia)","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates (UAE)","United Kingdom (UK)","United States of America (USA)","Uruguay","Uzbekistan","Vanuatu","Vatican City (Holy See)","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]
export const LANGUAGES = ["Algerian Arabic", "Amharic", "Assamese", "Bengali", "Bhojpuri", "Burmese", "Cebuano", "Chhattisgarhi", "Chittagonian", "Czech", "Deccan", "Dutch", "Eastern Punjabi", "Egyptian Arabic", "English", "French", "Gan", "German", "Greek", "Gujarati", "Hakka", "Hausa", "Hejazi Arabic", "Hindi", "Hungarian", "Igbo", "Indonesian", "Iranian Persian", "Italian", "Japanese", "Javanese", "Jinyu", "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Korean", "Magahi", "Maithili", "Malay", "Malayalam", "Mandarin", "Marathi", "Mesopotamian Arabic", "Min Bei Chinese", "Min Dong Chinese", "Min Nan", "Moroccan Arabic", "Nepali", "Nigerian Fulfulde", "North Levantine Arabic", "Northern Kurdish", "Northern Pashto", "Northern Uzbek", "Odia", "Polish", "Portuguese", "Romanian", "Rundi", "Russian", "Sanaani Spoken Arabic", "Saraiki", "Saʽidi Arabic", "Sindhi", "Sinhala", "Somali", "South Azerbaijani", "South Levantine Arabic", "Southern Pashto", "Spanish", "Sudanese Arabic", "Sunda", "Sylheti", "Tagalog", "Tamil", "Taʽizzi-Adeni Arabic", "Telugu", "Thai", "Tunisian Arabic", "Turkish", "Ukrainian", "Urdu", "Uyghur", "Vietnamese", "Western Punjabi", "Wu", "Xiang Chinese", "Yoruba", "Yue", "Zulu", "Other"]
export const GENRES = ["Absurdist", "Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Historical", "Historical fiction", "Horror", "Magical realism", "Mystery", "Paranoid fiction", "Philosophical", "Political", "Romance", "Saga", "Satire", "Science fiction", "Social", "Speculative", "Surreal", "Thriller", "Urban", "Western", "Whimsical", "Other"]

/**
 * Allowed tags for DOMPurify Sanitization,
 * b = bold, i = italics, u = underline, c = center, s = strikethru
 */
export const ALLOWED_TAGS = ['b', 'i', 'u', 'c', 's', 'br', 'hr']

export const CONST_SESSION_USER = 'SESSION_AUTH_DATA'

export const CONST_TITLE = "Reactale - Readers Act, Tales React - World's First Dynamic Story Reading / Writing Platform"