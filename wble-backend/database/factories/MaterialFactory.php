<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Section;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Material>
 */
class MaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fileTypes = [
            'lecture' => ['lecture_notes.pdf', 'slides.pptx'],
            'tutorial' => ['tutorial_worksheet.pdf', 'solutions.pdf'],
            'practical' => ['lab_manual.pdf', 'sample_code.zip'],
            'others' => ['additional_reading.pdf', 'reference.docx']
        ];
        
        $type = $this->faker->randomElement(['lecture', 'tutorial', 'practical', 'others']);
        $fileName = $this->faker->randomElement($fileTypes[$type]);
        
        // Generate a server-side path where files would be stored
        $filePath = "storage/materials/{$type}/{$fileName}";
        
        return [
            'section_id' => Section::count() > 0 
                ? Section::inRandomOrder()->first()->id 
                : Section::factory(),
            'type' => $type,
            'filename' => $fileName,
            'filepath' => $filePath,
        ];
    }
}
