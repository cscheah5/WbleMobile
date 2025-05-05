<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            [
                'name' => 'Wireless Application Development',
                'code' => 'UECS2433',
            ],
            [
                'name' => 'Mobile Application Development',
                'code' => 'UECS2434',
            ],
            [
                'name' => 'Web Application Development',
                'code' => 'UECS2435',
            ],
            [
                'name' => 'Cloud Computing',
                'code' => 'UECS2436',
            ],
            [
                'name' => 'Artificial Intelligence',
                'code' => 'UECS2437',
            ],
            [
                'name' => 'Machine Learning',
                'code' => 'UECS2438',
            ],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
