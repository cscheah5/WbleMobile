<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Subject;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teaching>
 */
class TeachingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject_id' => Subject::count() > 0
                ? Subject::inRandomOrder()->first()->id
                : Subject::factory(),
            'user_id' => User::where('role', 'lecturer')->count() > 0
                ? User::where('role', 'lecturer')->inRandomOrder()->first()->id
                : User::factory()->lecturer(),
        ];
    }
}
