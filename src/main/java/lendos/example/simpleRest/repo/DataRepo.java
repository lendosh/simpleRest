package lendos.example.simpleRest.repo;

import lendos.example.simpleRest.domain.Data;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataRepo extends JpaRepository<Data, Long> {
}
