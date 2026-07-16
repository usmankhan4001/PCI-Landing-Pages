import sys
import os
from PIL import Image, ImageDraw, ImageFont

def generate_wireframe():
    # Set canvas dimensions
    width = 1600
    height = 3600
    
    # Create background image
    # Theme colors
    bg_color = (13, 32, 54) # --charcoal-deep / #0d2036
    card_color = (20, 48, 76) # secondary slate / #14304c
    accent_color = (40, 118, 167) # --accent / #2876a7
    accent_light = (152, 205, 232) # --accent-light / #98cde8
    accent_tint = (234, 245, 251) # --accent-tint / #eaf5fb
    text_white = (255, 255, 255)
    text_muted = (152, 172, 193)
    green_color = (37, 211, 102) # WhatsApp / #25D366
    gold_color = (197, 160, 89) # Gold highlight / #c5a059
    grid_line_color = (30, 60, 90)
    
    image = Image.new("RGBA", (width, height), bg_color)
    draw = ImageDraw.Draw(image)
    
    # Try loading Segoe UI fonts, fallback to default
    try:
        font_title_large = ImageFont.truetype("C:\\Windows\\Fonts\\SegoeUI.ttf", 42)
        font_title = ImageFont.truetype("C:\\Windows\\Fonts\\SegoeUIb.ttf", 28)
        font_bold = ImageFont.truetype("C:\\Windows\\Fonts\\SegoeUIb.ttf", 20)
        font_reg = ImageFont.truetype("C:\\Windows\\Fonts\\SegoeUI.ttf", 16)
        font_small = ImageFont.truetype("C:\\Windows\\Fonts\\SegoeUI.ttf", 13)
        font_micro = ImageFont.truetype("C:\\Windows\\Fonts\\SegoeUI.ttf", 11)
    except Exception:
        font_title_large = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_reg = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_micro = ImageFont.load_default()

    # Draw Title & Layout Infographic Header
    draw.rectangle([0, 0, width, 120], fill=(9, 23, 40))
    draw.text((60, 25), "TECHNO ONE LANDING PAGE WIREFRAME", fill=text_white, font=font_title_large)
    draw.text((60, 75), "Sections, Spacing & Conversion Architecture", fill=accent_light, font=font_small)
    draw.text((1200, 45), "PREMIER CHOICE INTERNATIONAL", fill=gold_color, font=font_bold)
    draw.line([0, 120, width, 120], fill=accent_color, width=2)
    
    # Helper to draw a section banner
    def draw_section_header(y_pos, title, step_num):
        draw.rectangle([60, y_pos, 1540, y_pos+4], fill=grid_line_color)
        draw.text((60, y_pos + 15), f"{step_num}. {title.upper()}", fill=accent_light, font=font_bold)
    
    # ---------------- 1. HEADER & NAVIGATION (y: 160 - 240) ----------------
    draw_section_header(140, "Header & Global Navigation", "01")
    y = 200
    draw.rectangle([60, y, 1540, y+60], fill=card_color, outline=accent_color, width=1)
    draw.text((80, y+18), "[ TECHNO ONE LOGO ]", fill=text_white, font=font_bold)
    # Nav links
    nav_x = 420
    for link in ["Opportunity", "Location", "Amenities", "Plans", "Pricing", "Developer"]:
        draw.text((nav_x, y+20), link, fill=text_muted, font=font_reg)
        nav_x += 120
    # Header CTA
    draw.rectangle([1180, y+10, 1380, y+50], fill=(0,0,0,0), outline=accent_light, width=1)
    draw.text((1210, y+18), "Download Brochure", fill=accent_light, font=font_small)
    # WhatsApp Header CTA
    draw.rectangle([1400, y+10, 1520, y+50], fill=green_color)
    draw.text((1420, y+18), "WhatsApp", fill=(255,255,255), font=font_bold)
    
    # ---------------- 2. HERO SECTION & LEAD FORM (y: 290 - 900) ----------------
    draw_section_header(290, "Hero Spotlight & EOI Form", "02")
    y_hero = 340
    # Left Hero text box
    draw.rectangle([60, y_hero, 880, y_hero+480], fill=(16, 36, 62), outline=grid_line_color, width=1)
    draw.text((90, y_hero+40), "PREMIER CHOICE INTERNATIONAL — DHA PHASE 1, ISLAMABAD", fill=accent_light, font=font_small)
    draw.text((90, y_hero+70), "Some Buildings Are Occupied.\nFew Are Remembered.", fill=text_white, font=font_title_large)
    draw.text((90, y_hero+180), "Techno One is DHA Phase 1's next commercial landmark — retail,\noffices and rooftop dining under one address. Built for the\nbusinesses of tomorrow.", fill=text_muted, font=font_reg)
    # Primary CTA buttons in Hero Text column
    # Button 1: Download Brochure (Solid Filled)
    draw.rectangle([90, y_hero+290, 290, y_hero+340], fill=accent_color)
    draw.text((120, y_hero+303), "DOWNLOAD BROCHURE", fill=text_white, font=font_bold)
    # Button 2: WhatsApp Now (Outline)
    draw.rectangle([310, y_hero+290, 490, y_hero+340], fill=(0,0,0,0), outline=text_white, width=1)
    draw.text((345, y_hero+303), "WHATSAPP NOW", fill=text_white, font=font_bold)
    # Tags
    tags = ["Orchard Boulevard", "DHA Phase 1", "MLR Road Frontage", "LG+G+M+4+Rooftop"]
    tag_x = 90
    for tag in tags:
        draw.rectangle([tag_x, y_hero+390, tag_x+170, y_hero+425], fill=card_color, outline=accent_color)
        draw.text((tag_x+10, y_hero+400), tag, fill=accent_light, font=font_micro)
        tag_x += 185
        
    # Right Column: Hero Form Card with Accent Top Border (High contrast filled button!)
    draw.rectangle([930, y_hero, 1540, y_hero+480], fill=(255, 255, 255), outline=accent_light, width=1)
    # Accent top border (4px)
    draw.rectangle([930, y_hero, 1540, y_hero+6], fill=accent_color)
    draw.text((970, y_hero+35), "Get Payment Plan & Availability", fill=bg_color, font=font_bold)
    draw.text((970, y_hero+65), "Share your details — sales team responds within a few hours.", fill=(110, 125, 145), font=font_small)
    # Inputs
    fields = ["Full Name", "Phone / WhatsApp", "Email Address"]
    field_y = y_hero + 105
    for f in fields:
        draw.text((970, f_y := field_y), f, fill=(80, 95, 115), font=font_small)
        draw.rectangle([970, f_y+22, 1500, f_y+62], fill=(245, 247, 250), outline=(220, 225, 230))
        field_y += 75
    # Form Submit Button (Solid Filled Accent Color - Highly highlighted!)
    draw.rectangle([970, y_hero+350, 1500, y_hero+405], fill=accent_color)
    draw.text((1160, y_hero+365), "REQUEST DETAILS", fill=text_white, font=font_bold)
    draw.text((970, y_hero+425), "By submitting, you agree to be contacted by our sales team.", fill=(130, 145, 160), font=font_micro)
    
    # ---------------- 3. TRUST BAR (y: 855 - 945) ----------------
    y_tb = 860
    draw.rectangle([60, y_tb, 1540, y_tb+80], fill=(9, 23, 40), outline=accent_color)
    col_w = 493
    for i, (b_txt, s_txt) in enumerate([
        ("PREMIER CHOICE", "International Development"),
        ("DHA PHASE 1", "Orchard Boulevard, Islamabad"),
        ("LG+G+M+4+ROOFTOP", "Verified Structure")
    ]):
        x_off = 60 + i * col_w
        draw.text((x_off + 150, y_tb + 20), b_txt, fill=text_white, font=font_bold)
        draw.text((x_off + 150, y_tb + 45), s_txt, fill=accent_light, font=font_small)
        if i < 2:
            draw.line([x_off + col_w, y_tb+15, x_off + col_w, y_tb+65], fill=grid_line_color, width=1)
            
    # ---------------- 4. OPPORTUNITY & ABOUT SECTION (y: 980 - 1500) ----------------
    draw_section_header(970, "Spacious About Section & Expanded Asset Cards", "03")
    y_about = 1010
    draw.text((60, y_about+20), "01 / ABOUT THE PROJECT", fill=accent_color, font=font_bold)
    draw.text((60, y_about+50), "One Address. Three Ways to Perform.", fill=text_white, font=font_title)
    draw.text((700, y_about+40), "DHA 1 · LG+G+M+4+Rooftop — three asset classes in one commercial address,\nin a proven and constrained commercial corridor.", fill=text_muted, font=font_reg)
    
    # horizontal Investor benefits row (3 columns) - Expanded spacing!
    y_inv = y_about + 120
    draw.rectangle([60, y_inv, 1540, y_inv+110], fill=card_color, outline=grid_line_color)
    inv_col = 493
    for i, (title, desc) in enumerate([
        ("DHA Phase 1 Scarcity", "Commercial spaces are highly limited by design in DHA 1, ensuring long-term value protection."),
        ("High Rental Yields", "Techno One offers diversified rental income streams across three high-demand asset classes."),
        ("Capital Appreciation", "Orchard Boulevard is a highly constrained premium corridor guaranteeing stellar capital growth.")
    ]):
        x_off = 60 + i * inv_col
        draw.text((x_off+30, y_inv+20), title, fill=accent_light, font=font_bold)
        # Handle description wrap
        words = desc.split()
        line1 = " ".join(words[:7])
        line2 = " ".join(words[7:])
        draw.text((x_off+30, y_inv+48), line1, fill=text_muted, font=font_small)
        draw.text((x_off+30, y_inv+68), line2, fill=text_muted, font=font_small)
        if i < 2:
            draw.line([x_off + inv_col, y_inv+15, x_off + inv_col, y_inv+95], fill=grid_line_color, width=1)

    # 3 Spacious Full Width Asset Cards (Expanded Desktop Layout)
    y_cards = y_inv + 150
    draw.text((60, y_cards), "COMMERCIAL CONCEPT", fill=accent_light, font=font_bold)
    card_w = 460
    card_gap = 50
    for i, (tag, img_name, specs) in enumerate([
        ("RETAIL", "Retail Space", [("Floors", "LG, Ground, Mezz, 1st"), ("Units", "18 Shops"), ("Area", "337 - 968 Sq.Ft."), ("Rate", "45k - 89k/Sq.Ft.")]),
        ("OFFICES", "Corporate Offices", [("Floors", "2nd, 3rd, 4th"), ("Units", "18 Offices"), ("Area", "337 - 591 Sq.Ft."), ("Rate", "27.5k - 42.5k/Sq.Ft.")]),
        ("ROOFTOP", "Rooftop Terrace Dining", [("Level", "Penthouse / Roof"), ("Area", "2,500 Sq.Ft."), ("Dining", "Business & Social"), ("Features", "Terrace, City View")])
    ]):
        x_off = 60 + i * (card_w + card_gap)
        # Card outline
        draw.rectangle([x_off, y_cards+35, x_off+card_w, y_cards+335], fill=card_color, outline=accent_color, width=1)
        # Card image slot
        draw.rectangle([x_off, y_cards+35, x_off+card_w, y_cards+135], fill=(30, 60, 90))
        draw.text((x_off+130, y_cards+75), f"[ Image: {img_name} ]", fill=text_white, font=font_bold)
        # Tag
        draw.rectangle([x_off+20, y_cards+150, x_off+100, y_cards+175], fill=(0,0,0,0), outline=accent_light)
        draw.text((x_off+35, y_cards+156), tag, fill=accent_light, font=font_micro)
        # Specs Table
        spec_y = y_cards + 190
        for key, val in specs:
            draw.text((x_off+20, spec_y), key, fill=text_muted, font=font_small)
            draw.text((x_off+200, spec_y), val, fill=text_white, font=font_bold)
            draw.line([x_off+20, spec_y+20, x_off+card_w-20, spec_y+20], fill=grid_line_color, width=1)
            spec_y += 28

    # ---------------- 5. LOCKED LAYOUT PLANS & GATE (y: 1540 - 2080) ----------------
    draw_section_header(1530, "Interactive Elevation Widget & Lead-Gated Floor Plans", "04")
    y_plans = 1580
    draw.text((60, y_plans+20), "02 / LAYOUT PLANS", fill=accent_color, font=font_bold)
    draw.text((60, y_plans+50), "Spaces Planned for Business and Value", fill=text_white, font=font_title)
    
    # Floor plan tabs
    tabs = ["Rooftop", "4th Floor", "3rd Floor", "2nd Floor", "1st Floor", "Mezzanine", "Ground Floor (Active)", "Lower Ground"]
    tab_x = 60
    for tab in tabs:
        border_c = accent_color if "Active" in tab else grid_line_color
        bg_c = accent_color if "Active" in tab else card_color
        draw.rectangle([tab_x, y_plans+100, tab_x+165, y_plans+135], fill=bg_c, outline=border_c)
        draw.text((tab_x+15, y_plans+110), tab.replace(" (Active)", ""), fill=text_white, font=font_micro)
        tab_x += 185
        
    # Elevation layout: left elevation facade, right blurred floor plan container
    draw.rectangle([60, y_plans+160, 680, y_plans+480], fill=(22, 48, 77), outline=accent_color)
    draw.text((230, y_plans+310), "[ Interactive Elevation Facade ]\n   (Click any floor zone to view)", fill=accent_light, font=font_bold)
    
    # Right Column: Blurred Floor Plan with Pulse Lock Overlay
    draw.rectangle([720, y_plans+160, 1540, y_plans+480], fill=card_color, outline=accent_color)
    # Blurred placeholder representation
    for b_offset in range(180, 460, 20):
         draw.line([760, y_plans+b_offset, 1500, y_plans+b_offset], fill=(28, 62, 94), width=8)
    
    # Lock Card overlay center
    draw.rectangle([940, y_plans+200, 1320, y_plans+440], fill=(13, 32, 54, 230), outline=accent_light, width=1)
    draw.text((1060, y_plans+225), "[ LOCK ICON ]", fill=accent_light, font=font_bold)
    draw.text((1050, y_plans+265), "Unlock Floor Plans", fill=text_white, font=font_bold)
    draw.text((975, y_plans+295), "Submit your details once to unlock layouts\n    and availability for every level.", fill=text_muted, font=font_small)
    # Unlock CTA
    draw.rectangle([1010, y_plans+355, 1250, y_plans+405], fill=accent_color)
    draw.text((1060, y_plans+370), "UNLOCK FLOOR PLANS", fill=text_white, font=font_bold)

    # ---------------- 6. PRICING & PAYMENT PLAN (y: 2110 - 2750) ----------------
    draw_section_header(2110, "Pricing Structure & Customized Plan Selection", "05")
    y_price = 2150
    draw.text((60, y_price+20), "03 / PRICING & PAYMENT PLAN", fill=accent_color, font=font_bold)
    draw.text((60, y_price+50), "Real Rates, Real Terms", fill=text_white, font=font_title)
    
    # Unit stats summary container
    y_stats = y_price + 110
    draw.rectangle([60, y_stats, 1540, y_stats+80], fill=(9, 23, 40), outline=grid_line_color)
    p_col = 370
    stats_data = [
        ("18", "RETAIL SHOPS"),
        ("18", "CORPORATE OFFICES"),
        ("36", "TOTAL UNITS"),
        ("PKR 9M", "STARTING FROM") # Perfect typography symmetry fixed!
    ]
    for i, (b_txt, s_txt) in enumerate(stats_data):
        x_off = 60 + i * p_col
        # The price text "PKR 9M" is now perfectly rendered in identical style size
        draw.text((x_off + 110, y_stats + 18), b_txt, fill=text_white if i<3 else gold_color, font=font_bold)
        draw.text((x_off + 110, y_stats + 45), s_txt, fill=text_muted, font=font_micro)
        if i < 3:
            draw.line([x_off + p_col, y_stats+15, x_off + p_col, y_stats+65], fill=grid_line_color, width=1)
            
    # Payment columns: left standard stages table, right custom plan inline card
    y_pay_grid = y_stats + 120
    # Left Box
    draw.rectangle([60, y_pay_grid, 880, y_pay_grid+280], fill=card_color, outline=accent_color)
    draw.text((90, y_pay_grid+25), "Standard Payment Structure", fill=accent_light, font=font_bold)
    pay_stages = [("Down Payment", "30%", "At booking"), ("Installments", "60%", "24 monthly payments (2.5%/mo)"), ("Possession", "10%", "At handover")]
    st_y = y_pay_grid + 70
    for stage, pct, timing in pay_stages:
        draw.text((90, st_y), stage, fill=text_white, font=font_bold)
        draw.text((320, st_y), pct, fill=accent_light, font=font_bold)
        draw.text((450, st_y), timing, fill=text_muted, font=font_small)
        draw.line([90, st_y+24, 850, st_y+24], fill=grid_line_color, width=1)
        st_y += 48
        
    # Right Box: Custom Plan Request Card
    draw.rectangle([930, y_pay_grid, 1540, y_pay_grid+280], fill=card_color, outline=accent_color)
    draw.text((960, y_pay_grid+25), "Need a Customized Plan?", fill=gold_color, font=font_bold)
    draw.text((960, y_pay_grid+55), "Adjust your down payment, installment size, or duration.", fill=text_muted, font=font_small)
    # Chips representation
    chips = ["LOWER DP", "LOWER INSTALLMENT", "EXTENDED TENURE", "QUARTERLY", "UNIT-SPECIFIC"]
    chip_x = 960
    chip_y = y_pay_grid + 95
    for idx, chip in enumerate(chips):
        if idx == 2: # Wrap to next line
            chip_x = 960
            chip_y += 45
        draw.rectangle([chip_x, chip_y, chip_x+160, chip_y+35], fill=(0,0,0,0), outline=accent_light)
        draw.text((chip_x+10, chip_y+10), chip, fill=accent_light, font=font_micro)
        chip_x += 175
    # Request Custom Plan CTA
    draw.rectangle([960, y_pay_grid+200, 1220, y_pay_grid+245], fill=accent_color)
    draw.text((1010, y_pay_grid+215), "REQUEST CUSTOM PLAN", fill=text_white, font=font_bold)
    draw.rectangle([1250, y_pay_grid+200, 1510, y_pay_grid+245], fill=(0,0,0,0), outline=text_white, width=1)
    draw.text((1290, y_pay_grid+215), "DOWNLOAD STANDARD PLAN", fill=text_white, font=font_bold)

    # ---------------- 7. FOOTER LEAD SECTION (y: 2780 - 3280) ----------------
    draw_section_header(2780, "Conversion Checkpoint & Main Lead Form", "06")
    y_footer_form = 2820
    # Left copy block
    draw.text((60, y_footer_form+40), "04 / GET IN TOUCH", fill=accent_light, font=font_bold)
    draw.text((60, y_footer_form+70), "Get Payment Plan &\nAvailable Units", fill=text_white, font=font_title_large)
    draw.text((60, y_footer_form+175), "Fill in the form and our sales team will get back to you\nshortly with pricing, floor plans and unit availability.", fill=text_muted, font=font_reg)
    draw.text((60, y_footer_form+250), "✓  Full pricing sheet for shops & offices\n✓  Flexible payment plan breakdown\n✓  Current unit availability", fill=accent_light, font=font_bold)
    # WhatsApp Sales CTA
    draw.rectangle([60, y_footer_form+340, 420, y_footer_form+395], fill=green_color)
    draw.text((105, y_footer_form+355), "WHATSAPP SALES ADVISOR", fill=text_white, font=font_bold)
    
    # Right Column: Big Form Card with Accent Top Border (Interactive Hover Card!)
    draw.rectangle([720, y_footer_form+20, 1540, y_footer_form+440], fill=(255, 255, 255), outline=accent_light, width=1)
    # Accent top border (4px)
    draw.rectangle([720, y_footer_form+20, 1540, y_footer_form+26], fill=accent_color)
    draw.text((760, y_footer_form+50), "Request Project Package", fill=bg_color, font=font_bold)
    draw.text((760, f_y := y_footer_form+100), "Full Name", fill=(80, 95, 115), font=font_small)
    draw.rectangle([760, f_y+20, 1110, f_y+55], fill=(245, 247, 250), outline=(220, 225, 230))
    draw.text((1150, f_y), "Phone / WhatsApp", fill=(80, 95, 115), font=font_small)
    draw.rectangle([1150, f_y+20, 1500, f_y+55], fill=(245, 247, 250), outline=(220, 225, 230))
    
    draw.text((760, f_y := y_footer_form+180), "Email Address", fill=(80, 95, 115), font=font_small)
    draw.rectangle([760, f_y+20, 1500, f_y+55], fill=(245, 247, 250), outline=(220, 225, 230))
    
    draw.text((760, f_y := y_footer_form+260), "I am Interested In", fill=(80, 95, 115), font=font_small)
    draw.rectangle([760, f_y+20, 1110, f_y+55], fill=(245, 247, 250), outline=(220, 225, 230))
    draw.text((775, f_y+30), "Corporate Office", fill=(40,40,40), font=font_small)
    draw.text((1150, f_y), "Budget Range", fill=(80, 95, 115), font=font_small)
    draw.rectangle([1150, f_y+20, 1500, f_y+55], fill=(245, 247, 250), outline=(220, 225, 230))
    draw.text((1165, f_y+30), "PKR 10 - 25 Million", fill=(40,40,40), font=font_small)
    
    # Submit EOI button (Filled Blue)
    draw.rectangle([760, y_footer_form+350, 1500, y_footer_form+405], fill=accent_color)
    draw.text((1060, y_footer_form+365), "SEND ME DETAILS", fill=text_white, font=font_bold)

    # ---------------- 8. FOOTER (y: 3310 - 3600) ----------------
    y_ft = 3310
    draw.rectangle([0, y_ft, width, height], fill=(9, 23, 40))
    draw.text((60, y_ft+30), "Techno One Business Park", fill=text_white, font=font_bold)
    draw.text((60, y_ft+60), "Orchard Boulevard, DHA Phase 1, Islamabad\nAll rights reserved (c) 2026 Premier Choice International.", fill=text_muted, font=font_small)
    # Right column links
    draw.text((1100, y_ft+30), "PROJECT\n\nOpportunity\nLocation\nAmenities\nGallery", fill=text_white, font=font_small)
    draw.text((1300, y_ft+30), "INFORMATION\n\nPrivacy Policy\nTerms & Conditions\nDisclaimer\nOfficial Approvals", fill=text_white, font=font_small)

    # Save to path
    out_path = "E:\\Apps\\PCI\\Landing Pages\\techno_one_wireframe.png"
    image.save(out_path, "PNG")
    print(f"Wireframe image successfully generated and saved to {out_path}!")

if __name__ == "__main__":
    generate_wireframe()
