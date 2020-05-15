# Translations Processor
Hosting a github page for a simple translation processing tool.

### Specifications
1. Specify if file contains header
  * If not - specify header (column names)
1. Specify the translation key column 
1. Specify the columns to process (other than translation key)
1. Change column names (language strings)
1. Specify whether the translation key is to be separated
  * If yes - specify what the separator is
1. Specify whether to create one file per language (column)
1.[if not] Specify nesting of the language (*first* or *last*).
  * If key is not separated (nested) specify on what character to merge the language with the translation key.
    ex. '.' -> `language`.`translation_key`

