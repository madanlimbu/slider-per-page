File Structure ::
images -> contains images used in website
frontend -> contains css and java-script libraries 
data -> contains the excel-sheet and chronologyData.js

/***************************************************************************************/

Overview of data folder ::
	+ After filling in excel sheet, it will automatically generate Script in column AB
	+ This script will be used by chronologyData.js to generate output/changes in the website

/***************************************************************************************/

Options avaiable in Excel Sheet ::
	+ type : [section or slider] section is static page, while slider is images that are over the section 
	        extra-note -> All the slider type(images) under a section type will be displayed over that specific ssection
	
	+ anchorName : [1990s or 1990s#1 or 1990s#2] can contain date or date with hashtag-number
			extra-note -> All anchorName has to be unique 
			extra-note -> Only Section type can have anchorName
	
	+ innerSection : [left or right or center or quote] specify what this section type contains
			excel-note -> only section can contain innerSection
			
	+ translate : specifies how to translate the slider/images over a section
			note -> 2 way to go about it (custom or premade)
				premade options avaiable -> [left, right, top, bottom, topLeft, topRight, bottomLeft, bottomRight, leftTop, leftBottom, rightTop, rightBottom, leftToCenter, rightToCenter, topToCenter, bottomToCenter]
				custom option -> [customTranslate]
						extra-note -> when chossing [customTranslate], you need to specify (starting position)X, Y and (ending position) (X2, Y2)
						extra-note -> Only in [customTranslate] you can specify fade(column) to TRUE to make fade-in and fade-out animation if it is [customTranslate]
					extra-extra-note -> if you want a section with with just images without sliding effect, specify sectionPart(column) to (TRUE) and fill in only X and Y position
		
							Y (-100)
							'
							'
							'
							'
							'(0,0)
	 			(-100)	X - - - - - - - * - - - - - - - > X (+100)	
							'
							'
							'
							'
						       \'/
							'
							Y (+100)
		
	+ max_width/max_height : specifies the size of image [1-100], it will use the height and width of the screen to resize the image, i.e 50 width means the image size will be 50% of window width
	
	+ rotate : rotate the images [4 or -12 or ...]
	
	+ lightboxRotate : similarly rotate the image within the lightbox
	
	+ color : color of text [white or #000000 or ...]
	
	+ text_shadow : [2px 2px 2px #000000] css of text_shadow
	
	+ buttonText : text of button in the images
	
	+ dateTitle : this will create a large dateTitle over the section type contents [1926-1928]
	
	+ quoteWriter : the writer of quote should go in this coloumn

/***************************************************************************************/

Finally, once excel sheet modification is complete.
Just copy column AB and paste to inputData.js file
 extra-note -> paste it under the date specified in the file [/*************1930s***********/ under somethings like this] 
 
Final Notes ::
 -- Make sure the row number in excel of backgroundimage stays the same if a new row is added or removed 
