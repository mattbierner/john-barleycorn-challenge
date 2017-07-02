import json
import math

# https://web.archive.org/web/20040202204141/www.nhtsa.dot.gov/people/injury/alcohol/bacreport.html

WORDS_PER_MINUTE = 200 


def CalcBAC(mBodyWeight, mPercentWater, mOuncesEtOH, mMetabolicRate, mTimeInHours):
    # Based on calculations done by http:# www.nhtsa.dot.gov/people/injury/alcohol/bacreport.html
    # I'm following their math by each letter -- if you're confused by a step,
    # check out the website and go to the letter for more information
    cGramsPerOzEtOH = 23.36  # A constant: 29.57 ml/oz X .79 g/ml = 23.36 grams/oz
    # A) Convert weight to kg
    mBodyWeightKG = 58.06
    # B) Find total body water
    # Men have a higher water content than women
    mBodyWaterML = mBodyWeightKG * mPercentWater * 1000
    # C) cGramsPerOzEtOH is a constant variable (above)
    # D) Find alcohol per mL of water
    mConcEtOHinWater = cGramsPerOzEtOH * mOuncesEtOH / mBodyWaterML
    # E) Find alcohol per mL of blood
    mConcEtOHinBlood = mConcEtOHinWater * .806  # Blood is 80.6% water
    # F) Convert mConcEtOHinBlood from g/mL to g/100 mL (gram percent)
    mGramPercentEtOHinBlood = mConcEtOHinBlood * 100
    # Note: mGramPercentEtOHinBlood is the BAC with instant consumption, absorption, and distribution
    # G) G was taken care of back in D with the variable mOuncesEtOH
    # H) Calculate BAC after time span
    mBAC = mGramPercentEtOHinBlood - (mMetabolicRate * mTimeInHours)
    if mBAC < 0:
        return 0
    return mBAC


def calc(timeInMinutes, indicies):
    total = 0
    offset = timeInMinutes * WORDS_PER_MINUTE
    for i in indicies:
        if i > offset:
            break
        start = i * (1 / float(WORDS_PER_MINUTE))
        total += CalcBAC(100, .58, 1.5 * 0.4, .012,
                         (timeInMinutes - start) / 60.0)
    return total


with open('data.json', 'r') as f:
    data = json.load(f)

# print data['total_length'] / float(WORDS_PER_MINUTE) / 60.0

for i in xrange(0, int(math.ceil(data['total_length'] / float(WORDS_PER_MINUTE)))):
    x = calc(i, data['indicies'])
    print("{0} {1}".format(i, x))
